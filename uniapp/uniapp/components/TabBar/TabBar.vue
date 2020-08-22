<template>
	<view>
		<view style="height: 98rpx;"></view>
		<view class="wh_tab_section">
			<!-- 首页 -->
			<view class="navigator" :class="currentTabIndex == 0 ? 'on' : ''" @tap="tabBarSwitchTap(0)">
				<image mode="aspectFill"
					:src="currentTabIndex==0?tabList[0].selectedIcon:tabList[0].icon"></image>
				<view class="text" :class="currentTabIndex==0?'selected':''">{{tabList[0].text}}</view>
			</view>
			
			<!-- 我的 -->
			<view class="navigator" :class="currentTabIndex == 1 ? 'on' : ''" @tap="tabBarSwitchTap(1)">
				<image :src="currentTabIndex==1?tabList[1].selectedIcon:tabList[1].icon"></image>
				<view class="text" :class="currentTabIndex==1?'selected':''">{{tabList[1].text}}</view>
			</view>
		</view>
	</view>


</template>

<script>
	export default {
		data() {
			return {
				
				tabList: [{
						icon: '/static/images/tab_home_normal.png',
						selectedIcon: '/static/images/tab_home_selected.png',
						page: '/pages/tab_home/home',
                        text: '首页'
					},
					{
						icon: '/static/images/tab_mine_normal.png',
						selectedIcon: '/static/images/tab_mine_selected.png',
						page: '/pages/tab_mine/mine',
						text: '我的'
					}
				],
				currentTabIndex: this.current
			}
		},
		props: {
			current: {
				type: [Number, String],
				default: 0
			},
			color: {
				type: String,
				default: '#666666'
			},
			selectedColor: {
				type: String,
				default: '#FF8448'
			},
			backgroundColor: {
				type: String,
				default: '#FFFFFF'
			},
        },
        created() {
            
        },
		methods: {
			tabBarSwitchTap(index) {
				
				this.currentTabIndex = index
				
				uni.redirectTo({
					url: this.tabList[index].page
				})
				
				
				this.$emit('tabBarSwitchTap', index)
			}
		},
	}
</script>

<style lang="scss">
	.wh_tab_section {
		position: fixed;
		// z-index: 999;
		bottom: 0;
		left: 0;
		width: 100%;
		display: flex;
		background-color: #FFFFFF;
		height: 98rpx;
		border-top: 1rpx solid #EEEEEE;

		.navigator {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			// justify-content: center;
			text-align: center;

			.text {
				margin-top: 10rpx;
				line-height: 22rpx;
				font-size: 22rpx;
				color: #666666;
			}
			
			.center_text {
				
				// margin-top: -42rpx;
				line-height: 22rpx;
				font-size: 22rpx;
				color: #666666;
			}
			
			.center {
				flex: 1;
				margin-top: -42rpx;
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				overflow: hidden;
				background-color: #FFFFFF;
				image {
					width: 80rpx;
					height: 80rpx;
					border-radius: 40rpx;
					background-color: red;
				}
			}

			image {
				width: 50rpx;
				height: 50rpx;
			}

			.selected {
				color: #FF8448;
			}
		}
		.center_item {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-top: -42rpx;
			text-align: center;
			.center {
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				background-color: #FFFFFF;
				image {
					margin-top: 10rpx;
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
				}
			}
			.center_text {
				line-height: 22rpx;
				font-size: 22rpx;
				color: #666666;
			}
			.selected {
				color: #FF8448;
			}
		}
	}
</style>
