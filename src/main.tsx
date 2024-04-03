import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.tsx'
import './index.css'
import Muitheme from './themes/Muitheme.tsx'
import { Provider } from 'react-redux'
import { store } from './libs/store/index.ts'

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <Muitheme>
                <App />
            </Muitheme>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
)
