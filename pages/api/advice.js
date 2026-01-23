// API Route for Feature 2: AI Technical Advice

import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'
import XLSX from 'xlsx'
import mammoth from 'mammoth'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Base path for reference files
const basePath = path.join(process.cwd(), 'data', 'reference')
const getFilePath = (filename) => path.join(basePath, filename)

// Helper function to load Excel file
function loadExcelFile(filename) {
  try {
    const filePath = getFilePath(filename)
    console.log(`Loading Excel: ${filename}`)
    console.log(`Resolved path: ${filePath}`)
    console.log(`Current working directory: ${process.cwd()}`)
    
    if (!fs.existsSync(filePath)) {
      const error = new Error(`File not found: ${filename}`)
      error.fileName = filename
      error.resolvedPath = filePath
      error.cwd = process.cwd()
      throw error
    }
    
    const workbook = XLSX.readFile(filePath)
    
    // Get all sheet names
    const sheetNames = workbook.SheetNames
    let allData = []
    
    // Read all sheets
    for (const sheetName of sheetNames) {
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' })
      allData.push({
        sheetName,
        data: jsonData
      })
    }
    
    return allData
  } catch (error) {
    console.error(`Error loading Excel file ${filename}:`, error)
    if (error.fileName) {
      console.error(`  File name: ${error.fileName}`)
      console.error(`  Resolved path: ${error.resolvedPath}`)
      console.error(`  Current working directory: ${error.cwd}`)
    }
    throw error
  }
}

// Helper function to load Word file
async function loadWordFile(filename) {
  try {
    const filePath = getFilePath(filename)
    console.log(`Loading Word: ${filename}`)
    console.log(`Resolved path: ${filePath}`)
    console.log(`Current working directory: ${process.cwd()}`)
    
    if (!fs.existsSync(filePath)) {
      const error = new Error(`File not found: ${filename}`)
      error.fileName = filename
      error.resolvedPath = filePath
      error.cwd = process.cwd()
      throw error
    }
    
    const result = await mammoth.extractRawText({ path: filePath })
    return result.value
  } catch (error) {
    console.error(`Error loading Word file ${filename}:`, error)
    if (error.fileName) {
      console.error(`  File name: ${error.fileName}`)
      console.error(`  Resolved path: ${error.resolvedPath}`)
      console.error(`  Current working directory: ${error.cwd}`)
    }
    throw error
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { question } = req.body

    if (!question || !question.trim()) {
      return res.status(400).json({ error: '質問を入力してください' })
    }

    // OpenAI APIキーが設定されているか確認
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ 
        error: 'OpenAI APIキーが設定されていません。環境変数OPENAI_API_KEYを設定してください。' 
      })
    }

    // Load reference files
    console.log('Loading reference files...')
    
    let glossaryData = ''
    let documentText = ''
    
    try {
      // Load Excel glossary file
      const excelData = loadExcelFile('ボウタカAI　用語集.xlsx')
      // Convert Excel data to text format (include all rows, but limit total size)
      glossaryData = excelData.map(sheet => {
        const sheetText = sheet.data.map((row, index) => {
          // Only include non-empty values
          const rowText = Object.entries(row)
            .filter(([key, value]) => value && value.toString().trim() !== '')
            .map(([key, value]) => `${key}: ${value}`)
            .join(' | ')
          return rowText ? `${index + 1}. ${rowText}` : ''
        })
        .filter(line => line !== '')
        .join('\n')
        return sheetText ? `【${sheet.sheetName}】\n${sheetText}` : ''
      })
      .filter(sheet => sheet !== '')
      .join('\n\n')
      
      // Limit glossary data to 2500 characters to stay within token limits
      if (glossaryData.length > 2500) {
        glossaryData = glossaryData.substring(0, 2500) + '\n...（以下省略）'
      }
      
      console.log(`Loaded glossary from Excel (${excelData.length} sheets, ${glossaryData.length} chars)`)
      
      // Load Word document
      const fullDocumentText = await loadWordFile('最終ボウタカ.docx')
      // Limit to 3000 characters to stay within token limits
      if (fullDocumentText.length > 3000) {
        documentText = fullDocumentText.substring(0, 3000) + '\n...（以下省略）'
      } else {
        documentText = fullDocumentText
      }
      console.log(`Loaded document from Word (${fullDocumentText.length} -> ${documentText.length} characters)`)
    } catch (fileError) {
      console.error('Error loading reference files:', fileError)
      const errorResponse = {
        error: '参考資料の読み込みに失敗しました。ファイルが存在するか確認してください。',
        details: fileError.message
      }
      if (fileError.fileName) {
        errorResponse.fileName = fileError.fileName
        errorResponse.resolvedPath = fileError.resolvedPath
        errorResponse.cwd = fileError.cwd
        console.error(`  Failed file: ${fileError.fileName}`)
        console.error(`  Resolved path: ${fileError.resolvedPath}`)
        console.error(`  Current working directory: ${fileError.cwd}`)
      }
      return res.status(500).json(errorResponse)
    }

    // Build system prompt with reference materials
    let systemPrompt = 'あなたは棒高跳の専門コーチです。技術的な質問に対して、専門的で実践的なアドバイスを提供してください。\n\n'

    if (glossaryData) {
      systemPrompt += '【用語集】\n以下の用語集を参照して回答してください。\n' + glossaryData + '\n\n'
    }

    if (documentText) {
      systemPrompt += '【参考資料】\n以下の資料を参照して回答してください。\n' + documentText + '\n\n'
    }

    systemPrompt += '重要: 上記の用語集と参考資料に基づいて回答してください。ウェブ検索は行わず、提供された資料のみを使用してください。'

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: question
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const advice = completion.choices[0]?.message?.content || 'アドバイスを生成できませんでした'

    res.status(200).json({
      advice,
      question,
    })
  } catch (error) {
    console.error('OpenAI API error:', error)
    
    // エラーメッセージを適切に処理
    let errorMessage = 'アドバイスの取得中にエラーが発生しました'
    if (error.message) {
      errorMessage = error.message
    }

    res.status(500).json({ error: errorMessage })
  }
}
