<template>
	<button
		class="rounded-md py-2 px-4 text-center text-sm transition-all shadow-md hover:shadow-lg focus:shadow-none active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
		:class="buttonClass"
		@click="onClick">
		<slot />
	</button>
</template>

<script>
export default {
	name: 'BaseButton',
	props: {
		type: {
			type: String,
			default: 'primary', // Available options: primary, secondary, danger, etc.
		},
		onClick: {
			type: Function,
			default: () => {},
		},
	},
	computed: {
		buttonClass() {
			// Define different button styles based on the "type" prop
			const baseClasses = 'border border-transparent text-white transition-all';

			switch (this.type) {
				case 'secondary':
					return `${baseClasses} bg-gray-500 hover:bg-gray-600 focus:bg-gray-600 active:bg-gray-600`;
				case 'danger':
					return `${baseClasses} bg-red-600 hover:bg-red-700 focus:bg-red-700 active:bg-red-700`;
				case 'warning':
					return `${baseClasses} bg-yellow-500 hover:bg-yellow-600 focus:bg-yellow-600 active:bg-yellow-600 text-black`;
				case 'success':
					return `${baseClasses} bg-green-500 hover:bg-green-600 focus:bg-green-600 active:bg-green-600`;
				default:
					// Primary by default
					return `${baseClasses} bg-slate-800 hover:bg-slate-700 focus:bg-slate-700 active:bg-slate-700`;
			}
		},
	},
};
</script>

<style scoped></style>
