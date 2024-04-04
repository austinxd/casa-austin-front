import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import Muitheme from './themes/Muitheme.tsx'
import { Provider } from 'react-redux'
import { store } from './libs/store/index.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <Muitheme>
                <App />
            </Muitheme>
        </Provider>
    </React.StrictMode>
)
