export function Header() {
	return (
		<box justifyContent="center" alignItems="center">
			<box
				flexDirection="row"
				justifyContent="center"
				gap={0.5}
				alignItems="center"
			>
				<ascii-font text="cool" color="gray" font="tiny"/>
				<ascii-font text="code" font="tiny"/>
			</box>
		</box>
	);
}
