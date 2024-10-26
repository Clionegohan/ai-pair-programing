require('dotenv').config(); // .envの読み込みを最上部に配置

const { GoogleGenerativeAI } = require("@google/generative-ai");
const vscode = require('vscode');
const axios = require('axios');

// APIキーの取得
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error('APIキーがundefinedです。環境変数を確認してください。');
    process.exit(1);
}
console.log(`APIキー: ${apiKey}`);

/**
 * AIにリクエストを送る関数
 * @param {string} prompt - AIに送るコードやリクエスト内容
 * @returns {Promise<string>} - AIからの提案
 */
async function askAI(prompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateMessage?key=${apiKey}`;

    try {
        const response = await axios.post(
            url,
            {
                messages: [{ content: prompt }],
                temperature: 0.7,  // 必要に応じて調整
            },
            { headers: { 'Content-Type': 'application/json' } }
        );
        return response.data.candidates[0].content.trim();
    } catch (error) {
        console.error('APIエラー:', error.response ? error.response.data : error.message);
        throw error;
    }
}

/**
 * VSCodeの拡張機能のメイン関数
 * @param {vscode.ExtensionContext} context - VSCodeの拡張機能のコンテキスト
 */
function activate(context) {
    let disposable = vscode.commands.registerCommand('ai-pair-programming.askAI', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('エディタが開かれていません');
            return;
        }

        const selection = editor.selection;
        const code = editor.document.getText(selection);

        if (!code) {
            vscode.window.showErrorMessage('コードが選択されていません');
            return;
        }

        vscode.window.showInformationMessage('AIが提案を考えています...');

        try {
            const suggestion = await askAI(`このコードの改善案を教えて: \n\n${code}`);
            vscode.window.showInformationMessage(`AIからの提案: ${suggestion}`);
        } catch (error) {
            vscode.window.showErrorMessage(`エラーが発生しました: ${error.message}`);
        }
    });

    context.subscriptions.push(disposable);
}

// 拡張機能の終了時に呼ばれる関数
function deactivate() {}

module.exports = {
    activate,
    deactivate
};
