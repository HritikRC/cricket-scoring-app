import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { GlobalStateContextProvider } from './store/global-state-context.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<GlobalStateContextProvider>
		<App />
  	</GlobalStateContextProvider>
)
