import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import Muitheme from './themes/Muitheme.tsx'
import { Provider } from 'react-redux'

import 'dayjs/locale/es'
import 'dayjs/locale/en'
import 'react-phone-input-2/lib/material.css'
import 'react-phone-input-2/lib/style.css'
import { store } from './store/index.ts'
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <Muitheme>
                <App />
            </Muitheme>
        </Provider>
    </React.StrictMode>
)
