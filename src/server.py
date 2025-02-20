from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)  # 允许所有前端访问

VOLC_API_KEY = "75aaba48-0de3-49f5-9bca-9e0d39601c82"  
VOLC_API_URL = "https://ark.cn-beijing.volces.com/api/v3/chat/completions"  # 火山引擎 API 地址

@app.route("/chat", methods=["GET", "POST"])

def chat():
    try:
        data = request.json  # 获取前端发送的 JSON 数据
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {VOLC_API_KEY}"
        }
        response = requests.post(VOLC_API_URL, json=data, headers=headers)
        return jsonify(response.json())  # 返回火山引擎 API 响应
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
