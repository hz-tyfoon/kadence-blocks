/**
 * BLOCK: Kadence Progress Bar
 */

/**
 * Import Css
 */
import './editor.scss';

import {
	TypographyControls,
	PopColorControl,
	WebfontLoader,
	ResponsiveRangeControls,
	ResponsiveMeasureRangeControl,
	ResponsiveAlignControls,
	InspectorControlTabs,
	KadencePanelBody,
} from '@kadence/components';

import {
	KadenceColorOutput,
	getPreviewSize,
	getSpacingOptionOutput,
	getFontSizeOptionOutput,
	setBlockDefaults,
	getUniqueId
} from '@kadence/helpers';

import {
	lineBar,
	circleBar,
	semiCircleBar,
} from '@kadence/icons';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import {
	useState,
	useEffect,
	useCallback,
	useMemo,
	Fragment
} from '@wordpress/element';
import { useBlockProps, BlockAlignmentControl } from '@wordpress/block-editor';
import { map } from 'lodash';
import {
	RichText,
	InspectorControls,
	BlockControls,
} from '@wordpress/block-editor';

import {
	PanelBody,
	SelectControl,
	ButtonGroup,
	Button,
	ToggleControl,
	RangeControl,
	TextControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import {
	Circle,
	SemiCircle,
	Line,
} from 'progressbar.js';
/**
 * Internal dependencies
 */
import classnames from 'classnames';

export function Edit( props ) {

	const {
		attributes,
		setAttributes,
		isSelected,
		clientId,
	} = props;

	const {
		uniqueID,
		align,
		paddingTablet,
		paddingDesktop,
		paddingMobile,
		paddingUnit,
		marginTablet,
		marginDesktop,
		marginMobile,
		marginUnit,
		barBackground,
		barBackgroundOpacity,
		progressColor,
		progressOpacity,
		barType,
		containerMaxWidth,
		tabletContainerMaxWidth,
		mobileContainerMaxWidth,
		containerMaxWidthUnits,
		displayLabel,
		labelFont,
		label,
		labelPosition,
		progressAmount,
		progressMax,
		displayPercent,
		numberSuffix,
		numberPrefix,
		numberIsRelative,
		duration,
		progressWidth,
		progressWidthTablet,
		progressWidthMobile,
		progressBorderRadius,
		easing,
		labelLayout,
		hAlign,
		thAlign,
		mhAlign,
		delayUntilInView,
	} = attributes;

	const { addUniqueID } = useDispatch( 'kadenceblocks/data' );
	const { isUniqueID, isUniqueBlock, previewDevice } = useSelect(
		( select ) => {
			return {
				isUniqueID   : ( value ) => select( 'kadenceblocks/data' ).isUniqueID( value ),
				isUniqueBlock: ( value, clientId ) => select( 'kadenceblocks/data' ).isUniqueBlock( value, clientId ),
				previewDevice: select( 'kadenceblocks/data' ).getPreviewDeviceType(),
			};
		},
		[ clientId ],
	);

	useEffect( () => {
		setBlockDefaults( 'kadence/progress-bar', attributes);

		let uniqueId = getUniqueId( uniqueID, clientId, isUniqueID, isUniqueBlock );
		if ( uniqueId !== uniqueID ) {
			attributes.uniqueID = uniqueId;
			setAttributes( { uniqueID: uniqueId } );
			addUniqueID( uniqueId, clientId );
		} else {
			addUniqueID( uniqueID, clientId );
		}
	}, [] );

	const [ activeTab, setActiveTab ] = useState( 'general' );

	const previewMarginTop = getPreviewSize( previewDevice, ( undefined !== marginDesktop ? marginDesktop[ 0 ] : '' ), ( undefined !== marginTablet ? marginTablet[ 0 ] : '' ), ( undefined !== marginMobile ? marginMobile[ 0 ] : '' ) );
	const previewMarginRight = getPreviewSize( previewDevice, ( undefined !== marginDesktop ? marginDesktop[ 1 ] : '' ), ( undefined !== marginTablet ? marginTablet[ 1 ] : '' ), ( undefined !== marginMobile ? marginMobile[ 1 ] : '' ) );
	const previewMarginBottom = getPreviewSize( previewDevice, ( undefined !== marginDesktop ? marginDesktop[ 2 ] : '' ), ( undefined !== marginTablet ? marginTablet[ 2 ] : '' ), ( undefined !== marginMobile ? marginMobile[ 2 ] : '' ) );
	const previewMarginLeft = getPreviewSize( previewDevice, ( undefined !== marginDesktop ? marginDesktop[ 3 ] : '' ), ( undefined !== marginTablet ? marginTablet[ 3 ] : '' ), ( undefined !== marginMobile ? marginMobile[ 3 ] : '' ) );

	const previewPaddingTop = getPreviewSize( previewDevice, ( undefined !== paddingDesktop ? paddingDesktop[ 0 ] : '' ), ( undefined !== paddingTablet ? paddingTablet[ 0 ] : '' ), ( undefined !== paddingMobile ? paddingMobile[ 0 ] : '' ) );
	const previewPaddingRight = getPreviewSize( previewDevice, ( undefined !== paddingDesktop ? paddingDesktop[ 1 ] : '' ), ( undefined !== paddingTablet ? paddingTablet[ 1 ] : '' ), ( undefined !== paddingMobile ? paddingMobile[ 1 ] : '' ) );
	const previewPaddingBottom = getPreviewSize( previewDevice, ( undefined !== paddingDesktop ? paddingDesktop[ 2 ] : '' ), ( undefined !== paddingTablet ? paddingTablet[ 2 ] : '' ), ( undefined !== paddingMobile ? paddingMobile[ 2 ] : '' ) );
	const previewPaddingLeft = getPreviewSize( previewDevice, ( undefined !== paddingDesktop ? paddingDesktop[ 3 ] : '' ), ( undefined !== paddingTablet ? paddingTablet[ 3 ] : '' ), ( undefined !== paddingMobile ? paddingMobile[ 3 ] : '' ) );

	const previewProgressWidth = getPreviewSize( previewDevice, ( undefined !== progressWidth ? progressWidth : '' ), ( undefined !== progressWidthTablet ? progressWidthTablet : '' ), ( undefined !== progressWidthMobile ? progressWidthMobile : '' ) );
	const previewProgressBorderRadius = getPreviewSize( previewDevice, ( undefined !== progressBorderRadius[ 0 ] ? progressBorderRadius[ 0 ] : '' ), ( undefined !== progressBorderRadius[ 1 ] ? progressBorderRadius[ 1 ] : '' ), ( undefined !== progressBorderRadius[ 2 ] ? progressBorderRadius[ 2 ] : '' ) );

	const previewContainerMaxWidth = getPreviewSize( previewDevice, ( undefined !== containerMaxWidth ? containerMaxWidth : '' ), ( undefined !== tabletContainerMaxWidth ? tabletContainerMaxWidth : '' ), ( undefined !== mobileContainerMaxWidth ? mobileContainerMaxWidth : '' ) );

	const previewLabelFont = getPreviewSize( previewDevice, ( undefined !== labelFont.size && undefined !== labelFont.size[ 0 ] && '' !== labelFont.size[ 0 ] ? labelFont.size[ 0 ] : '' ), ( undefined !== labelFont.size && undefined !== labelFont.size[ 1 ] && '' !== labelFont.size[ 1 ] ? labelFont.size[ 1 ] : '' ), ( undefined !== labelFont.size && undefined !== labelFont.size[ 2 ] && '' !== labelFont.size[ 2 ] ? labelFont.size[ 2 ] : '' ) );
	const previewLabelLineHeight = getPreviewSize( previewDevice, ( undefined !== labelFont.lineHeight && undefined !== labelFont.lineHeight[ 0 ] && '' !== labelFont.lineHeight[ 0 ] ? labelFont.lineHeight[ 0 ] : '' ), ( undefined !== labelFont.lineHeight && undefined !== labelFont.lineHeight[ 1 ] && '' !== labelFont.lineHeight[ 1 ] ? labelFont.lineHeight[ 1 ] : '' ), ( undefined !== labelFont.lineHeight && undefined !== labelFont.lineHeight[ 2 ] && '' !== labelFont.lineHeight[ 2 ] ? labelFont.lineHeight[ 2 ] : '' ) );
	const previewAlign = getPreviewSize( previewDevice, ( undefined !== hAlign ? hAlign : '' ), ( undefined !== thAlign ? thAlign : '' ), ( undefined !== mhAlign ? mhAlign : '' ) );

	const containerClasses = classnames( {
		'kb-progress-bar-container'               : true,
		[ `kb-progress-bar-container${uniqueID}` ]: true,
		[ `kb-progress-bar-type-${barType}` ]     : true,
	} );

	const blockProps = useBlockProps( {
		className: containerClasses,
	} );

	const layoutPresetOptions = [
		{ key: 'line', name: __( 'Line', 'kadence-blocks' ), icon: lineBar },
		{ key: 'circle', name: __( 'Circle', 'kadence-blocks' ), icon: circleBar },
		{ key: 'semicircle', name: __( 'Semicircle', 'kadence-blocks' ), icon: semiCircleBar },

	];
	const labelFontConfigObj = {
		google: {
			families: [ labelFont.family + ( labelFont.variant ? ':' + labelFont.variant : '' ) ],
		},
	};
	const labelFontConfig = ( labelFont.google ? labelFontConfigObj : '' );

	const progressLabelStyles = {
		fontWeight   : labelFont.weight,
		fontStyle    : labelFont.style,
		color        : KadenceColorOutput( labelFont.color ),
		fontSize     : ( previewLabelFont ? getFontSizeOptionOutput( previewLabelFont, labelFont.sizeType ) : undefined ),
		lineHeight   : ( previewLabelLineHeight ? previewLabelLineHeight + labelFont.lineType : undefined ),
		letterSpacing: labelFont.letterSpacing + 'px',
		textTransform: ( labelFont.textTransform ? labelFont.textTransform : undefined ),
		fontFamily   : ( labelFont.family ? labelFont.family : '' ),
		padding      : ( labelFont.padding ? labelFont.padding[ 0 ] + 'px ' + labelFont.padding[ 1 ] + 'px ' + labelFont.padding[ 2 ] + 'px ' + labelFont.padding[ 3 ] + 'px' : '' ),
		margin       : ( labelFont.margin ? labelFont.margin[ 0 ] + 'px ' + labelFont.margin[ 1 ] + 'px ' + labelFont.margin[ 2 ] + 'px ' + labelFont.margin[ 3 ] + 'px' : '' ),
	};

	const progressAttributes = {
		color      : KadenceColorOutput( progressColor, progressOpacity ),
		strokeWidth: previewProgressWidth,
		duration   : ( duration === 0 ? 1 : duration * 1000 ),
		easing     : easing,
		trailWidth : previewProgressWidth,
		trailColor : KadenceColorOutput( barBackground, barBackgroundOpacity ),
		svgStyle   : {
			borderRadius: ( barType === 'line' ? previewProgressBorderRadius + 'px' : '' ),
		},
		step: function( state, bar ) {
			let iFrameSelector = document.getElementsByName('editor-canvas');
			let selector = iFrameSelector.length > 0 ? document.getElementsByName( 'editor-canvas' )[ 0 ].contentWindow.document : document;

			let elementAbove = selector.getElementById( 'current-progress-above' + uniqueID );
			let elementInside = selector.getElementById( 'current-progress-inside' + uniqueID );
			let elementBelow = selector.getElementById( 'current-progress-below' + uniqueID );
			let value;

			if ( numberIsRelative ) {
				value = Math.round( bar.value() * 100 );
			} else {
				value = Math.round( bar.value() * progressMax );
			}

			if ( elementAbove && labelPosition === 'above' && displayPercent ) {
				elementAbove.innerHTML = numberPrefix + value + numberSuffix;
			} else if ( elementAbove ) {
				elementAbove.innerHTML = '';
			}

			if ( elementInside && labelPosition === 'inside' && displayPercent ) {
				elementInside.innerHTML = numberPrefix + value + numberSuffix;
			} else if ( elementInside ) {
				elementInside.innerHTML = '';
			}

			if ( elementBelow && labelPosition === 'below' && displayPercent ) {
				elementBelow.innerHTML = numberPrefix + value + numberSuffix;
			} else if ( elementBelow ) {
				elementBelow.innerHTML = '';
			}
		},
	};

	const container = document.createElement( 'div' );
	const progress = useMemo( () => {
		if ( barType === 'line' ) {
			return new Line( container, progressAttributes );
		} else if ( barType === 'circle' ) {
			return new Circle( container, progressAttributes );
		} else if ( barType === 'semicircle' ) {
			return new SemiCircle( container, progressAttributes );
		}
	}, [ progressAttributes, previewDevice ] );

	const ProgressItem = () => {
		const node = useCallback( node => {
			if ( node ) {
				node.appendChild( container );
			}
		}, [] );

		useEffect( () => {
			progress.animate( progressAmount / progressMax );
		}, [ previewDevice, progressAmount, progressMax ] );

		return <div ref={node}/>;
	};

	const saveLabelFont = ( value ) => {
		setAttributes( {
			labelFont: { ...labelFont, ...value },
		} );
	};

	const RenderLabel = ( currentPosition ) => {
		if ( currentPosition !== labelPosition || ( !displayLabel && !displayPercent ) ) {
			return null;
		}

		let wrapperLayoutStyles = {};

		if ( previewAlign === 'space-between' ) {
			wrapperLayoutStyles.justifyContent = 'space-between';
		} else if ( previewAlign === 'center' ) {
			wrapperLayoutStyles.justifyContent = 'center';
			wrapperLayoutStyles.textAlign = 'center';
		} else if ( previewAlign === 'left' ) {
			wrapperLayoutStyles.justifyContent = 'flex-start';
		} else if ( previewAlign === 'right' ) {
			wrapperLayoutStyles.textAlign = 'right';
			wrapperLayoutStyles.justifyContent = 'flex-end';
		}

		if ( labelLayout === 'lt' || labelLayout === 'lb' ) {
			wrapperLayoutStyles.flexDirection = 'column';
		}

		if ( labelPosition === 'inside' && previewAlign === 'center' ) {
			wrapperLayoutStyles.transform = 'translateX(-50%) translateY(-50%)';
			wrapperLayoutStyles.left = '50%';
		} else if ( labelPosition === 'inside' && previewAlign === 'right' ) {
			wrapperLayoutStyles.right = '0%';
		}

		if ( barType === 'line' && labelPosition === 'inside' && previewAlign === 'space-between' ) {
			wrapperLayoutStyles.width = '100%';
		}

		return (
			<div
				className={'kb-progress-label-wrap ' + ( currentPosition === 'inside' ? 'kt-progress-label-inside' : '' )}
				style={wrapperLayoutStyles}
			>

				{displayPercent && ( labelLayout === 'lb' || labelLayout === 'pl' ) ? <span id={'current-progress-' + currentPosition + uniqueID} style={progressLabelStyles}></span> : null}

				{displayLabel &&
					<RichText
						tagName={'span'}
						value={label}
						onChange={( value ) => {
							setAttributes( { label: value } );
						}}
						placeholder={__( 'Progress', 'kadence-blocks' )}
						style={progressLabelStyles}
						className={'kt-progress-label'}
					/>
				}

				{displayPercent && ( labelLayout === 'lt' || labelLayout === 'lp' ) ? <span id={'current-progress-' + currentPosition + uniqueID} style={progressLabelStyles}></span> : null}

			</div>
		);
	};

	return (
		<div {...blockProps}>
			<BlockControls group="block">
				<BlockAlignmentControl
					value={align}
					onChange={( value ) => setAttributes( { align: value } )}
				/>
			</BlockControls>
			<InspectorControls>
				<InspectorControlTabs
					panelName={'progress-bar'}
					setActiveTab={setActiveTab}
					activeTab={activeTab}
				/>

				{( activeTab === 'general' ) && (
					<>
						<PanelBody>
							<ButtonGroup className="kt-style-btn-group kb-info-layouts" aria-label={__( 'Progress Bar Layout', 'kadence-blocks' )}>
								{map( layoutPresetOptions, ( { name, key, icon } ) => (
									<Button
										key={key}
										className="kt-style-btn"
										isSmall
										isPrimary={false}
										label={name}
										aria-pressed={false}
										onClick={
											() => setAttributes( { barType: key } )
										}
										style={{
											border     : ( barType === key ? '2px solid #2B6CB0' : '0' ),
											marginRight: '4px',
											width      : '75px',
										}}
									>
										{icon}
									</Button>
								) )}
							</ButtonGroup>
						</PanelBody>

						{/* These are the wordpress and Kadence components mostly that are imported at the top */}
						<KadencePanelBody>

							<PopColorControl
								label={__( 'Progress Background', 'kadence-blocks' )}
								colorValue={( barBackground ? barBackground : '#4A5568' )}
								colorDefault={'#4A5568'}
								opacityValue={barBackgroundOpacity}
								onColorChange={value => setAttributes( { barBackground: value } )}
								onOpacityChange={value => setAttributes( { barBackgroundOpacity: value } )}
							/>
							<PopColorControl
								label={__( 'Progress Color', 'kadence-blocks' )}
								colorValue={( progressColor ? progressColor : '#4A5568' )}
								colorDefault={'#4A5568'}
								opacityValue={progressOpacity}
								onColorChange={value => setAttributes( { progressColor: value } )}
								onOpacityChange={value => setAttributes( { progressOpacity: value } )}
							/>
							<ResponsiveRangeControls
								label={__( 'Progress Thickness', 'kadence-blocks' )}
								value={progressWidth}
								tabletValue={progressWidthTablet}
								mobileValue={progressWidthMobile}
								onChange={( value ) => {
									setAttributes( { progressWidth: value } );
								}}
								onChangeTablet={( value ) => {
									setAttributes( { progressWidthTablet: value } );
								}}
								onChangeMobile={( value ) => {
									setAttributes( { progressWidthMobile: value } );
								}}

								allowEmpty={false}
								min={0.25}
								max={50}
								step={0.25}

							/>
							{( 'line' === barType ) && (
								<ResponsiveRangeControls
									label={__( 'Border Radius', 'kadence-blocks' )}
									value={progressBorderRadius[ 0 ]}
									tabletValue={progressBorderRadius[ 1 ]}
									mobileValue={progressBorderRadius[ 2 ]}
									onChange={( value ) => setAttributes( { progressBorderRadius: [ value, ( progressBorderRadius && progressBorderRadius[ 1 ] ? progressBorderRadius[ 1 ] : '' ), ( progressBorderRadius && progressBorderRadius[ 2 ] ? progressBorderRadius[ 2 ] : '' ) ] } )}
									onChangeTablet={( value ) => setAttributes( { progressBorderRadius: [ ( progressBorderRadius && progressBorderRadius[ 0 ] ? progressBorderRadius[ 0 ] : '' ), value, ( progressBorderRadius && progressBorderRadius[ 2 ] ? progressBorderRadius[ 2 ] : '' ) ] } )}
									onChangeMobile={( value ) => setAttributes( { progressBorderRadius: [ ( progressBorderRadius && progressBorderRadius[ 0 ] ? progressBorderRadius[ 0 ] : '' ), ( progressBorderRadius && progressBorderRadius[ 1 ] ? progressBorderRadius[ 1 ] : '' ), value ] } )}


									allowEmpty={true}
									min={0}
									max={50}
									step={1}
									unit={'px'}
								/>
							)}
							<RangeControl
								label={__( 'Progress', 'kadence-blocks' )}
								value={progressAmount}
								onChange={( value ) => setAttributes( { progressAmount: value } )}
								min={0}
								max={progressMax}
								step={1}
							/>
							<RangeControl
								label={__( 'Max Progress', 'kadence-blocks' )}
								value={progressMax}
								onChange={( value ) => setAttributes( { progressMax: value } )}
								min={1}
								max={1000}
								step={1}
							/>

						</KadencePanelBody>

						<KadencePanelBody
							title={__( 'Number Settings', 'kadence-blocks' )}
							initialOpen={true}
							panelName={'kb-progress-percentage-settings'}
						>
							<ToggleControl
								label={__( 'Show Number', 'kadence-blocks' )}
								checked={displayPercent}
								onChange={( value ) => setAttributes( { displayPercent: value } )}
							/>

							{displayPercent && (
								<Fragment>
									<TextControl
										label={__( 'Number Prefix', 'kadence-blocks' )}
										value={numberPrefix}
										onChange={( value ) => setAttributes( { numberPrefix: value } )}
									/>
									<TextControl
										label={__( 'Number Suffix', 'kadence-blocks' )}
										value={numberSuffix}
										onChange={( value ) => setAttributes( { numberSuffix: value } )}
									/>
									{progressMax !== 100 && (
										<ToggleControl
											label={__( 'Percentage relative to 100%', 'kadence-blocks' )}
											checked={numberIsRelative}
											onChange={( value ) => setAttributes( { numberIsRelative: value } )}
										/>
									)}

								</Fragment>
							)}

						</KadencePanelBody>

						<KadencePanelBody
							title={__( 'Animation', 'kadence-blocks' )}
							initialOpen={false}
							panelName={'kb-progress-bar-timing'}
						>
							<RangeControl
								label={__( 'Duration', 'kadence-blocks' )}
								value={duration}
								onChange={( value ) => setAttributes( { duration: value } )}
								min={0}
								max={25}
								step={0.1}
							/>

							<ToggleControl
								label={__( 'Wait until visible to animate', 'kadence-blocks' )}
								checked={delayUntilInView}
								onChange={( value ) => setAttributes( { delayUntilInView: value } )}
							/>

							<SelectControl
								label={__( 'Type', 'kadence-blocks' )}
								options={
									[ { value: 'linear', label: __( 'Linear', 'kadence-blocks' ) },
									  { value: 'easeIn', label: __( 'Ease In', 'kadence-blocks' ) },
									  { value: 'easeOut', label: __( 'Ease Out', 'kadence-blocks' ) },
									  { value: 'easeInOut', label: __( 'Ease In Out', 'kadence-blocks' ) } ]
								}
								value={easing}
								onChange={( value ) => setAttributes( { easing: value } )}
							/>

						</KadencePanelBody>

					</>

				)}


				{( activeTab === 'style' ) && (

					<Fragment>
						<KadencePanelBody>
							<ToggleGroupControl
								label={__( 'Label Position', 'kadence-blocks' )}
								value={labelPosition}
								onChange={( value ) => setAttributes( { labelPosition: value } )}
								isBlock
							>
								<ToggleGroupControlOption value="above" label={__( 'Above', 'kadence-blocks' )}/>
								<ToggleGroupControlOption value="inside" label={__( 'Inside', 'kadence-blocks' )}/>
								<ToggleGroupControlOption value="below" label={__( 'Below', 'kadence-blocks' )}/>
							</ToggleGroupControl>

							{labelPosition !== 'inside' || barType === 'line' ? (
								<ResponsiveAlignControls
									label={__( 'Label Alignment', 'kadence-blocks' )}
									value={( hAlign ? hAlign : '' )}
									mobileValue={( mhAlign ? mhAlign : '' )}
									tabletValue={( thAlign ? thAlign : '' )}
									onChange={( nextAlign ) => setAttributes( { hAlign: ( nextAlign ? nextAlign : 'space-between' ) } )}
									onChangeTablet={( nextAlign ) => setAttributes( { thAlign: ( nextAlign ? nextAlign : '' ) } )}
									onChangeMobile={( nextAlign ) => setAttributes( { mhAlign: ( nextAlign ? nextAlign : '' ) } )}
									type={'justify'}
								/> ) : null
							}

							{displayLabel && displayPercent ? (
								<SelectControl
									label={__( 'Label Layout', 'kadence-blocks' )}
									options={[
										{ value: 'lp', label: __( 'Label then %', 'kadence-blocks' ) },
										{ value: 'pl', label: __( '% then Label', 'kadence-blocks' ) },
										{ value: 'lt', label: __( 'Label above %', 'kadence-blocks' ) },
										{ value: 'lb', label: __( 'Label below %', 'kadence-blocks' ) },
									]}
									value={labelLayout}
									onChange={( value ) => setAttributes( { labelLayout: value } )}
								/>
							) : null}

							<ToggleControl
								label={__( 'Show Label', 'kadence-blocks' )}
								checked={displayLabel}
								onChange={( value ) => setAttributes( { displayLabel: value } )}
							/>

						</KadencePanelBody>

						<KadencePanelBody
							title={__( 'Text Styling', 'kadence-blocks' )}
							initialOpen={true}
							panelName={'kb-testimonials-title-settings'}
						>
							<PopColorControl
								label={__( 'Color Settings', 'kadence-blocks' )}
								value={( labelFont.color ? labelFont.color : '' )}
								default={''}
								onChange={value => saveLabelFont( { color: value } )}
							/>
							<TypographyControls
								fontGroup={'heading'}
								fontSize={labelFont.size}
								onFontSize={( value ) => saveLabelFont( { size: value } )}
								fontSizeType={labelFont.sizeType}
								onFontSizeType={( value ) => saveLabelFont( { sizeType: value } )}
								lineHeight={labelFont.lineHeight}
								onLineHeight={( value ) => saveLabelFont( { lineHeight: value } )}
								lineHeightType={labelFont.lineType}
								onLineHeightType={( value ) => saveLabelFont( { lineType: value } )}
								letterSpacing={labelFont.letterSpacing}
								onLetterSpacing={( value ) => saveLabelFont( { letterSpacing: value } )}
								textTransform={labelFont.textTransform}
								onTextTransform={( value ) => saveLabelFont( { textTransform: value } )}
								fontFamily={labelFont.family}
								onFontFamily={( value ) => saveLabelFont( { family: value } )}
								onFontChange={( select ) => {
									saveLabelFont( {
										family: select.value,
										google: select.google,
									} );
								}}
								onFontArrayChange={( values ) => saveLabelFont( values )}
								googleFont={labelFont.google}
								onGoogleFont={( value ) => saveLabelFont( { google: value } )}
								loadGoogleFont={labelFont.loadGoogle}
								onLoadGoogleFont={( value ) => saveLabelFont( { loadGoogle: value } )}
								fontVariant={labelFont.variant}
								onFontVariant={( value ) => saveLabelFont( { variant: value } )}
								fontWeight={labelFont.weight}
								onFontWeight={( value ) => saveLabelFont( { weight: value } )}
								fontStyle={labelFont.style}
								onFontStyle={( value ) => saveLabelFont( { style: value } )}
								fontSubset={labelFont.subset}
								onFontSubset={( value ) => saveLabelFont( { subset: value } )}
								padding={labelFont.padding}
								onPadding={( value ) => saveLabelFont( { padding: value } )}
								margin={labelFont.margin}
								onMargin={( value ) => saveLabelFont( { margin: value } )}
							/>
						</KadencePanelBody>
					</Fragment>

				)}

				{activeTab === 'advanced' && (
					<KadencePanelBody>
						<ResponsiveRangeControls
							label={__( 'Width', 'kadence-blocks' )}
							value={containerMaxWidth}
							onChange={value => setAttributes( { containerMaxWidth: value } )}
							tabletValue={( tabletContainerMaxWidth ? tabletContainerMaxWidth : '' )}
							onChangeTablet={( value ) => setAttributes( { tabletContainerMaxWidth: value } )}
							mobileValue={( mobileContainerMaxWidth ? mobileContainerMaxWidth : '' )}
							onChangeMobile={( value ) => setAttributes( { mobileContainerMaxWidth: value } )}
							min={0}
							max={( containerMaxWidthUnits === 'px' ? 3000 : 100 )}
							step={1}
							unit={containerMaxWidthUnits}
							onUnit={( value ) => setAttributes( { containerMaxWidthUnits: value } )}
							reset={() => setAttributes( { containerMaxWidth: 0, tabletContainerMaxWidth: '', mobileContainerMaxWidth: '' } )}
							units={[ 'px', 'vh', '%' ]}
						/>
						<ResponsiveMeasureRangeControl
							label={__( 'Margin', 'kadence-blocks' )}
							value={marginDesktop}
							tabletValue={marginTablet}
							mobileValue={marginMobile}
							onChange={( value ) => {
								setAttributes( { marginDesktop: value } );
							}}
							onChangeTablet={( value ) => setAttributes( { marginTablet: value } )}
							onChangeMobile={( value ) => setAttributes( { marginMobile: value } )}
							min={( marginUnit === 'em' || marginUnit === 'rem' ? -12 : -200 )}
							max={( marginUnit === 'em' || marginUnit === 'rem' ? 24 : 200 )}
							step={( marginUnit === 'em' || marginUnit === 'rem' ? 0.1 : 1 )}
							unit={marginUnit}
							units={[ 'px', 'em', 'rem', '%', 'vh' ]}
							onUnit={( value ) => setAttributes( { marginUnit: value } )}
							// onMouseOver={ marginMouseOver.onMouseOver }
							// onMouseOut={ marginMouseOver.onMouseOut }
						/>
					</KadencePanelBody>
				)}

			</InspectorControls>
			<div style={
				{
					position     : 'relative',
					marginTop    : ( '' !== previewMarginTop ? getSpacingOptionOutput( previewMarginTop, marginUnit ) : undefined ),
					marginRight  : ( '' !== previewMarginRight ? getSpacingOptionOutput( previewMarginRight, marginUnit ) : undefined ),
					marginBottom : ( '' !== previewMarginBottom ? getSpacingOptionOutput( previewMarginBottom, marginUnit ) : undefined ),
					marginLeft   : ( '' !== previewMarginLeft ? getSpacingOptionOutput( previewMarginLeft, marginUnit ) : undefined ),
					width        : ( previewContainerMaxWidth ? previewContainerMaxWidth + containerMaxWidthUnits : 'none' ),
					paddingTop   : ( '' !== previewPaddingTop ? getSpacingOptionOutput( previewPaddingTop, paddingUnit ) : undefined ),
					paddingRight : ( '' !== previewPaddingRight ? getSpacingOptionOutput( previewPaddingRight, paddingUnit ) : undefined ),
					paddingBottom: ( '' !== previewPaddingBottom ? getSpacingOptionOutput( previewPaddingBottom, paddingUnit ) : undefined ),
					paddingLeft  : ( '' !== previewPaddingLeft ? getSpacingOptionOutput( previewPaddingLeft, paddingUnit ) : undefined ),
				}
			}>

				{RenderLabel( 'above' )}

				<ProgressItem/>

				{RenderLabel( 'inside' )}

				{RenderLabel( 'below' )}
			</div>

			{labelFont.google && (
				<WebfontLoader config={labelFontConfig}>
				</WebfontLoader>
			)}
		</div>
	);
}

export default ( Edit );
