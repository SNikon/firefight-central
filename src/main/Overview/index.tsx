import { Button } from "../../_components/Button"
import { CardGrid } from "../../_components/CardGrid"
import { VehicleCard } from "../../_components/VehicleCard"
import { VehicleState } from "../../_consts/native"
import sample1 from '../../_assets/sample1.png'
import sample2 from '../../_assets/sample2.png'

export const Overview = () => {
	return (
		<div className="bg-body-background text-body-text flex flex-col overflow-hidden">	
			<div className="flex justify-end space-x-4 px-5 py-2 mb-5">
				<Button onClick={() => {}}>Nova Ocurrência</Button>
			</div>

			<CardGrid>
				<VehicleCard id="1" state={VehicleState.Available} />
				<VehicleCard id="1" image={sample1} state={VehicleState.Available} />
				<VehicleCard id="1" image={sample2} state={VehicleState.Available} />
				<VehicleCard id="1" state={VehicleState.Dispatched} />
				<VehicleCard id="1" image={sample1} state={VehicleState.Dispatched} />
				<VehicleCard id="1" image={sample2} state={VehicleState.Dispatched} />
				<VehicleCard id="1" state={VehicleState.Unavailable} />
				<VehicleCard id="1" image={sample1} state={VehicleState.Unavailable} />
				<VehicleCard id="1" image={sample2} state={VehicleState.Unavailable} />

				<VehicleCard id="1" state={VehicleState.Available} selected />
				<VehicleCard id="1" image={sample1} state={VehicleState.Available} selected />
				<VehicleCard id="1" image={sample2} state={VehicleState.Available} selected />
				<VehicleCard id="1" state={VehicleState.Dispatched} selected />
				<VehicleCard id="1" image={sample1} state={VehicleState.Dispatched} selected />
				<VehicleCard id="1" image={sample2} state={VehicleState.Dispatched} selected />
				<VehicleCard id="1" state={VehicleState.Unavailable} selected />
				<VehicleCard id="1" image={sample1} state={VehicleState.Unavailable} selected />
				<VehicleCard id="1" image={sample2} state={VehicleState.Unavailable} selected />
			</CardGrid>
		</div>
	)
}
