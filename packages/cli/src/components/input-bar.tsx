import { EmptyBorder } from "./empty-border";
import { StatusBar } from "./status-bar";

type props = {
	onSubmit: (text: string) => void;
	disabled?: boolean;
};

export function InputBar({ onSubmit, disabled = false }: props) {
	return (
		<box width="100%" alignItems="center">
			<box
				// todo: add left border
				customBorderChars={{
					...EmptyBorder,
					vertical: "│",
				}}
			>
				<box
					position="relative"
					justifyContent="center"
					paddingX={2}
					paddingY={1}
					backgroundColor="#1A1A24"
					width="100%"
					gap={1}
				>
					<textarea
						focused={!disabled}
						placeholder={`Ask anything... "Fix a bug in database"`}
					/>
					<StatusBar />
				</box>
			</box>
		</box>
	);
}
