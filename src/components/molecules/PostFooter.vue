<template>
	<div class="flex justify-between items-center">
		<BaseTimestamp :timestamp="timestamp" />
		<div class="space-x-4">
			<BasePostButton label="Like" />
			<BasePostButton label="Comment" />
			<BasePostButton label="Share" />
		</div>
	</div>
</template>

<script>
import BaseTimestamp from '../atoms/BaseTimestamp.vue';
import BasePostButton from '../atoms/BasePostButton.vue';

export default {
	props: {
		timestamp: {
			type: String,
			required: true,
		},
	},
	components: { BaseTimestamp, BasePostButton },
};
</script>
