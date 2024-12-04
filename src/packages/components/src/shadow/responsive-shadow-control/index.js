/**
 * Import Externals
 */
import PopColorControl from '../../pop-color-control';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import {Component, useState} from '@wordpress/element';
import { ToggleControl } from '@wordpress/components';
import { map, isEqual } from 'lodash';
import { useSelect, useDispatch } from '@wordpress/data';
import { default as ShadowControl } from '../shadow-control';

import {
	Dashicon,
	Button,
	ButtonGroup,
} from '@wordpress/components';
import {capitalizeFirstLetter} from '@kadence/helpers';
import RangeControl from "../../range/range-control";
import {undo} from "@wordpress/icons";

/**
 * Build the BoxShadow controls
 * @returns {object} BoxShadow settings.
 */
export default function ResponsiveShadowControl ( {
	label,
	enable = true,
	color,
	colorDefault,
	blur,
	hOffset,
	vOffset,
	onColorChange,
	onBlurChange,
	onHOffsetChange,
	onVOffsetChange,
	onEnableChange,
	className = '',
	reset = true,
} ) {
	const [ deviceType, setDeviceType ] = useState( 'Desktop' );
	const previewDevice = useSelect( ( select ) => {
		return select( 'kadenceblocks/data' ).getPreviewDeviceType();
	}, [] );
	if ( previewDevice !== deviceType ) {
		setDeviceType( previewDevice );
	}
	const {
		setPreviewDeviceType,
	} = useDispatch( 'kadenceblocks/data' );
	const customSetPreviewDeviceType = ( device ) => {
		setPreviewDeviceType( capitalizeFirstLetter( device ) );
		setDeviceType( capitalizeFirstLetter( device ) );
	};

	const onReset = () => {
		onEnableChange('reset');
	}
	const devices = [
		{
			name: 'Desktop',
			key: 'desktop',
			title: <Dashicon icon="desktop" />,
			itemClass: 'kb-desk-tab',
		},
		{
			name: 'Tablet',
			key: 'tablet',
			title: <Dashicon icon="tablet" />,
			itemClass: 'kb-tablet-tab',
		},
		{
			name: 'Mobile',
			key: 'mobile',
			title: <Dashicon icon="smartphone" />,
			itemClass: 'kb-mobile-tab',
		},
	];
	const output = {};
	output.Mobile = (
		<ShadowControl
			key={'mobile-text-shadow-control'}
			label={__('Text Shadow', 'kadence-blocks')}
			enable={ enable }
			color={ color }
			colorDefault={ colorDefault }
			hOffset={ hOffset }
			vOffset={ vOffset }
			blur={ blur }
			onEnableChange={ onEnableChange }
			onColorChange={ onColorChange }
			onHOffsetChange={ onHOffsetChange }
			onVOffsetChange={ onVOffsetChange }
			onBlurChange={ onBlurChange }
		/>
	);
	output.Tablet = (
		<ShadowControl
			key={'tablet-text-shadow-control'}
			label={__('Text Shadow', 'kadence-blocks')}
			enable={ enable }
			color={ color }
			colorDefault={ colorDefault }
			hOffset={ hOffset }
			vOffset={ vOffset }
			blur={ blur }
			onEnableChange={ onEnableChange }
			onColorChange={ onColorChange }
			onHOffsetChange={ onHOffsetChange }
			onVOffsetChange={ onVOffsetChange }
			onBlurChange={ onBlurChange }
		/>
	);
	output.Desktop = (
		<ShadowControl
			key={'desktop-text-shadow-control'}
			label={__('Text Shadow', 'kadence-blocks')}
			enable={ enable }
			color={ color }
			colorDefault={ colorDefault }
			hOffset={ hOffset }
			vOffset={ vOffset }
			blur={ blur }
			onEnableChange={ onEnableChange }
			onColorChange={ onColorChange }
			onHOffsetChange={ onHOffsetChange }
			onVOffsetChange={ onVOffsetChange }
			onBlurChange={ onBlurChange }
		/>
	);

	return [
		onEnableChange && (
			<div className={ `components-base-control kb-responsive-range-control${ '' !== className ? ' ' + className : '' }` }>
				<div className="kadence-title-bar">
					{ label && (
						<span className="kadence-control-title">
								{ label }
							{ reset && (
								<Button
									className="is-reset is-single"
									isSmall
									disabled={ enable === false }
									icon={ undo }
									onClick={() => {
										if (typeof reset === 'function') {
											reset();
										} else {
											onReset();
										}
									}}
								></Button>
							) }
						</span>
					) }
					<ButtonGroup className="kb-measure-responsive-options" aria-label={ __( 'Device', 'kadence-blocks' ) }>
						{ map( devices, ( { name, key, title, itemClass } ) => (
							<Button
								key={ key }
								className={ `kb-responsive-btn ${ itemClass }${ name === deviceType ? ' is-active' : '' }` }
								isSmall
								aria-pressed={ deviceType === name }
								onClick={ () => customSetPreviewDeviceType( name ) }
							>
								{ title }
							</Button>
						) ) }
					</ButtonGroup>
				</div>
				{ ( output[ deviceType ] ? output[ deviceType ] : output.Desktop ) }
			</div>
		)
	];
}