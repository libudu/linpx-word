import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

// 全局css
import './index.less'
// 自定义脚本语言
import './scripts'

ReactDOM.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>,
  document.getElementById('root')
);
