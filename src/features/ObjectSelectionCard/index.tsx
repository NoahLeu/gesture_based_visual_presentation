type ObjectSelectionCardProps = {
	id: string;
	isActive: boolean;
	selectObject: (id: string) => void;
	name: string;
	src: string;
};

const ObjectSelectionCard = ({
	id,
	isActive,
	selectObject,
	name,
	src,
}: ObjectSelectionCardProps) => {
	return (
		<div
			id={id}
			key={id}
			className="w-full h-fit bg-primary flex flex-col rounded-xl shadow-lg items-start justify-center transition-all duration-200 ease-in-out p-8"
		>
			<div className="w-full relative">
				<img
					src={src}
					className="w-full aspect-square rounded-lg"
					alt="model"
				/>
				{isActive && (
					<p className="text-green font-bold bg-primary shadow-sm rounded-lg absolute top-0 right-0 p-2">
						ACTIVE
					</p>
				)}
			</div>
			<div className="w-full flex justify-between items-center mt-2">
				<p className="text-lg text-white font-bold">{name}</p>
				<button className="btn-primary" onClick={() => selectObject(id)}>
					Select
				</button>
			</div>
		</div>
	);
};
export default ObjectSelectionCard;
