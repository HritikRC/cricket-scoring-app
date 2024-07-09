import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useContext } from 'react';
import Intro from "./stages/intro/Intro";
import SelectPlayers from './stages/selectPlayers/SelectPlayers';
import GlobalStateContext from './store/global-state-context';
import Game from './stages/game/Game';
import { Inning1StateContextProvider } from './store/inning1-state-context';
import { Inning2StateContextProvider } from './store/inning2-state-context';
import { Inning3StateContextProvider } from './store/inning3-state-context';

function App() {

	const globalStateCtx = useContext(GlobalStateContext);

	return (
		<div>
			{
				globalStateCtx.stage == 0 ?
					<Intro />
				: globalStateCtx.stage == 1 ?
					<SelectPlayers />
				: globalStateCtx.stage == 2 ?
					<Inning1StateContextProvider>
        				<Inning2StateContextProvider>
        					<Inning3StateContextProvider>
								<Game />
							</Inning3StateContextProvider>
        				</Inning2StateContextProvider>
        			</Inning1StateContextProvider>
				: null
			}
		</div>
	);
}

export default App;
