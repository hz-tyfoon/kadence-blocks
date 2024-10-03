/**
 * Template: Mega Menu 2 (Pro) Ecosystem nav
 * Post Type: kadence_navigation
 */

import { createBlock } from '@wordpress/blocks';

const postMeta = {
	_kad_navigation_collapseSubMenus: '1',
	_kad_navigation_collapseSubMenusTablet: '1',
	_kad_navigation_collapseSubMenusMobile: '1',
	_kad_navigation_orientation: 'vertical',
	_kad_navigation_spacing: ['1', '1', '1', '1'],
	_kad_navigation_linkColor: 'palette3',
	_kad_navigation_linkColorHover: 'palette3',
	_kad_navigation_linkColorActive: 'palette3',
	_kad_navigation_backgroundHover: 'palette8',
	_kad_navigation_backgroundActive: 'palette8',
	_kad_navigation_typography: [
		{
			size: ['sm', '', ''],
			sizeType: 'px',
			lineHeight: ['', '', ''],
			lineType: '',
			letterSpacing: ['', '', ''],
			letterType: 'px',
			textTransform: '',
			family: '',
			google: false,
			style: '',
			weight: 'bold',
			variant: '',
			subset: '',
			loadGoogle: true,
		},
	],
};

function innerBlocks() {
	return [
		createBlock('kadence/navigation', {}, [
			createBlock(
				'kadence/navigation-link',
				{
					uniqueID: '372_59c297-f5',
					label: 'Short Title',
					description: 'Use this space to add a short description.',
					url: '#',
					kind: 'custom',
					typography: [
						{
							size: ['', '', ''],
							sizeType: 'px',
							lineHeight: ['', '', ''],
							lineType: '',
							letterSpacing: ['', '', ''],
							letterType: 'px',
							textTransform: '',
							family: '',
							google: '',
							style: '',
							weight: '400',
							variant: '',
							subset: '',
							loadGoogle: true,
						},
					],
					mediaType: 'icon',
					mediaAlign: 'left',
					mediaIcon: [
						{
							icon: 'fe_cloud',
							size: 20,
							sizeTablet: '',
							sizeMobile: '',
							width: 2,
							widthTablet: 2,
							widthMobile: 2,
							hoverAnimation: 'none',
							title: '',
							flipIcon: '',
						},
					],
					mediaColor: 'palette9',
					mediaBackground: 'palette1',
					mediaBorderRadius: ['3', '3', '3', '3'],
					mediaStyle: [
						{
							color: 'palette9',
							colorTablet: '',
							colorMobile: '',
							colorHover: '',
							colorHoverTablet: '',
							colorHoverMobile: '',
							colorActive: '',
							colorActiveTablet: '',
							colorActiveMobile: '',
							background: 'palette1',
							backgroundTablet: '',
							backgroundMobile: '',
							backgroundHover: '',
							backgroundHoverTablet: '',
							backgroundHoverMobile: '',
							backgroundActive: '',
							backgroundActiveTablet: '',
							backgroundActiveMobile: '',
							border: '',
							hoverBorder: '',
							borderRadius: 3,
							borderRadiusTablet: '',
							borderRadiusMobile: '',
							borderWidth: [0, 0, 0, 0],
							padding: [5, 5, 5, 5],
							paddingTablet: ['', '', '', ''],
							paddingMobile: ['', '', '', ''],
							paddingType: 'px',
							margin: [10, '', '', ''],
							marginTablet: ['', '', '', ''],
							marginMobile: ['', '', '', ''],
							marginType: 'px',
						},
					],
					descriptionSpacing: '5',
					descriptionColor: 'palette5',
					descriptionColorHover: 'palette5',
					descriptionColorActive: 'palette5',
					borderRadiusHover: [30, 30, 30, 30],
					borderRadiusActive: [30, 30, 30, 30],
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{
					uniqueID: '372_833e19-55',
					label: 'Short Title',
					description: 'Use this space to add a short description.',
					url: '#',
					kind: 'custom',
					typography: [
						{
							size: ['', '', ''],
							sizeType: 'px',
							lineHeight: ['', '', ''],
							lineType: '',
							letterSpacing: ['', '', ''],
							letterType: 'px',
							textTransform: '',
							family: '',
							google: '',
							style: '',
							weight: '400',
							variant: '',
							subset: '',
							loadGoogle: true,
						},
					],
					mediaType: 'icon',
					mediaAlign: 'left',
					mediaIcon: [
						{
							icon: 'fe_cloudLightning',
							size: 20,
							sizeTablet: '',
							sizeMobile: '',
							width: 2,
							widthTablet: 2,
							widthMobile: 2,
							hoverAnimation: 'none',
							title: '',
							flipIcon: '',
						},
					],
					mediaColor: 'palette9',
					mediaBackground: 'palette2',
					mediaBorderRadius: ['3', '3', '3', '3'],
					mediaStyle: [
						{
							color: 'palette9',
							colorTablet: '',
							colorMobile: '',
							colorHover: '',
							colorHoverTablet: '',
							colorHoverMobile: '',
							colorActive: '',
							colorActiveTablet: '',
							colorActiveMobile: '',
							background: 'palette2',
							backgroundTablet: '',
							backgroundMobile: '',
							backgroundHover: '',
							backgroundHoverTablet: '',
							backgroundHoverMobile: '',
							backgroundActive: '',
							backgroundActiveTablet: '',
							backgroundActiveMobile: '',
							border: '',
							hoverBorder: '',
							borderRadius: 3,
							borderRadiusTablet: '',
							borderRadiusMobile: '',
							borderWidth: [0, 0, 0, 0],
							padding: [5, 5, 5, 5],
							paddingTablet: ['', '', '', ''],
							paddingMobile: ['', '', '', ''],
							paddingType: 'px',
							margin: [10, '', '', ''],
							marginTablet: ['', '', '', ''],
							marginMobile: ['', '', '', ''],
							marginType: 'px',
						},
					],
					descriptionSpacing: '5',
					descriptionColor: 'palette5',
					descriptionColorHover: 'palette5',
					descriptionColorActive: 'palette5',
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{
					uniqueID: '372_70deb0-0d',
					label: 'Short Title',
					description: 'Use this space to add a short description.',
					url: '#',
					kind: 'custom',
					typography: [
						{
							size: ['', '', ''],
							sizeType: 'px',
							lineHeight: ['', '', ''],
							lineType: '',
							letterSpacing: ['', '', ''],
							letterType: 'px',
							textTransform: '',
							family: '',
							google: '',
							style: '',
							weight: '400',
							variant: '',
							subset: '',
							loadGoogle: true,
						},
					],
					mediaType: 'icon',
					mediaAlign: 'left',
					mediaIcon: [
						{
							icon: 'fe_cloudDrizzle',
							size: 20,
							sizeTablet: '',
							sizeMobile: '',
							width: 2,
							widthTablet: 2,
							widthMobile: 2,
							hoverAnimation: 'none',
							title: '',
							flipIcon: '',
						},
					],
					mediaColor: 'palette9',
					mediaBackground: 'palette4',
					mediaBorderRadius: ['3', '3', '3', '3'],
					mediaStyle: [
						{
							color: 'palette9',
							colorTablet: '',
							colorMobile: '',
							colorHover: '',
							colorHoverTablet: '',
							colorHoverMobile: '',
							colorActive: '',
							colorActiveTablet: '',
							colorActiveMobile: '',
							background: 'palette4',
							backgroundTablet: '',
							backgroundMobile: '',
							backgroundHover: '',
							backgroundHoverTablet: '',
							backgroundHoverMobile: '',
							backgroundActive: '',
							backgroundActiveTablet: '',
							backgroundActiveMobile: '',
							border: '',
							hoverBorder: '',
							borderRadius: 3,
							borderRadiusTablet: '',
							borderRadiusMobile: '',
							borderWidth: [0, 0, 0, 0],
							padding: [5, 5, 5, 5],
							paddingTablet: ['', '', '', ''],
							paddingMobile: ['', '', '', ''],
							paddingType: 'px',
							margin: [10, '', '', ''],
							marginTablet: ['', '', '', ''],
							marginMobile: ['', '', '', ''],
							marginType: 'px',
						},
					],
					descriptionSpacing: '5',
					descriptionColor: 'palette5',
					descriptionColorHover: 'palette5',
					descriptionColorActive: 'palette5',
				},
				[]
			),
		]),
	];
}

export { postMeta, innerBlocks };