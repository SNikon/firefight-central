import { invoke } from "@tauri-apps/api/tauri"

const execute = () => { invoke("greet", { name: 'Fina' }) }

export const Overview = () => {
	return <div className="font-bold underline">
		Omelette Du Fromage	
		
		<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={execute}>
			Click Me
		</button>
	</div>
}