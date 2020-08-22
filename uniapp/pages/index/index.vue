<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>
		<tab-bar :current="0"></tab-bar>
	</view>
</template>

<script>
	import { mapState, mapMutations, mapActions } from 'vuex'
	import app from '../../common/app'
	import {home} from '../../services/index'
	export default {
		computed: mapState(['userInfo']),
		components: { },
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {
			// store - actions
			this.$store.dispatch("")
		},
		methods: {
			...mapMutations(['',]),
			...mapActions(['']),
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
