import { createRoot } from 'react-dom/client'
import {store} from './redux/Store.tsx'
import {Provider} from 'react-redux'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(

    <Provider store={store}>
    <App />
    </Provider>

)
