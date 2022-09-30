import {
    Component,
    Fragment,
    useState,
    useEffect
} from '@wordpress/element';
import {
    ToggleControl,
    RangeControl,
    PanelBody,
    TabPanel,
    Dashicon,
    ButtonGroup,
    SelectControl,
    Button,
    Tooltip,
    Modal,
} from '@wordpress/components';
import {map} from 'lodash';
import {TypographyControls, MeasurementControls, PopColorControl} from '@kadence/components';
import {
    blockTabsIcon,
    radiusIndividualIcon,
    radiusLinkedIcon,
    bottomLeftIcon,
    bottomRightIcon,
    topLeftIcon,
    topRightIcon,
    tabsIcon,
    vTabsIcon,
    accordionIcon
} from '@kadence/icons';
/**
 * Internal block libraries
 */
import {__} from '@wordpress/i18n';
import {useDispatch} from '@wordpress/data';
import {store as noticesStore} from '@wordpress/notices';

function KadenceTabsDefault(props) {

    const [isOpen, setIsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [configuration, setConfiguration] = useState((kadence_blocks_params.configuration ? JSON.parse(kadence_blocks_params.configuration) : {}));
    const {createErrorNotice} = useDispatch(noticesStore);

    useEffect(() => {
        // Check for old defaults.
        if (!configuration['kadence/tabs']) {
            const blockConfig = kadence_blocks_params.config['kadence/tabs'];
            if (blockConfig !== undefined && typeof blockConfig === 'object') {
                Object.keys(blockConfig).map((attribute) => {
                    saveConfigState(attribute, blockConfig[attribute]);
                });
            }
        }
    }, []);

    const saveConfig = (blockID, settingArray) => {
        setIsSaving(true);
        const config = (kadence_blocks_params.configuration ? JSON.parse(kadence_blocks_params.configuration) : {});
        if (!config[blockID]) {
            config[blockID] = {};
        }
        config[blockID] = settingArray;
        const settingModel = new wp.api.models.Settings({kadence_blocks_config_blocks: JSON.stringify(config)});
        settingModel.save().then(response => {
            createErrorNotice(__('Block defaults saved!', 'kadence-blocks'), {
                type: 'snackbar',
            });

			setIsSaving(false);
			setConfiguration({ ...config });
			setIsOpen(false);
			
            kadence_blocks_params.configuration = JSON.stringify(config);
        });
    }

    const saveConfigState = (key, value) => {
        const config = configuration;
        if (config['kadence/tabs'] === undefined || config['kadence/tabs'].length == 0) {
            config['kadence/tabs'] = {};
        }
        config['kadence/tabs'][key] = value;
		setConfiguration({ ...config });
    }

    const tabsConfig = (configuration && configuration['kadence/tabs'] ? configuration['kadence/tabs'] : {});
    const mLayoutOptions = [
        {key: 'tabs', name: __('Tabs'), icon: tabsIcon},
        {key: 'vtabs', name: __('Vertical Tabs'), icon: vTabsIcon},
        {key: 'accordion', name: __('Accordion'), icon: accordionIcon},
    ];
    const layoutOptions = [
        {key: 'tabs', name: __('Tabs'), icon: tabsIcon},
        {key: 'vtabs', name: __('Vertical Tabs'), icon: vTabsIcon},
    ];
    const sizeTypes = [
        {key: 'px', name: __('px')},
        {key: 'em', name: __('em')},
    ];
    const sizeType = (tabsConfig.sizeType ? tabsConfig.sizeType : 'px');
    const lineType = (tabsConfig.lineType ? tabsConfig.lineType : 'px');
    const fontMin = (sizeType === 'em' ? 0.2 : 5);
    const fontMax = (sizeType === 'em' ? 12 : 200);
    const fontStep = (sizeType === 'em' ? 0.1 : 1);
    const lineMin = (lineType === 'em' ? 0.2 : 5);
    const lineMax = (lineType === 'em' ? 12 : 200);
    const lineStep = (lineType === 'em' ? 0.1 : 1);
    const deskControls = (
        <Fragment>
            <p className="components-base-control__label">{__('Layout', 'kadence-blocks')}</p>
            <ButtonGroup aria-label={__('Layout')}>
                {map(layoutOptions, ({name, key, icon}) => (
                    <Tooltip text={name}>
                        <Button
                            key={key}
                            className="kt-layout-btn kt-tablayout"
                            isSmall
                            isPrimary={(tabsConfig.layout ? tabsConfig.layout : 'tabs') === key}
                            aria-pressed={(tabsConfig.layout ? tabsConfig.layout : 'tabs') === key}
                            onClick={() => saveConfigState('layout', key)}
                        >
                            {icon}
                        </Button>
                    </Tooltip>
                ))}
            </ButtonGroup>
        </Fragment>
    );
    const tabletControls = (
        <Fragment>
            <p className="components-base-control__label">{__('Tablet Layout', 'kadence-blocks')}</p>
            <ButtonGroup aria-label={__('Tablet Layout')}>
                {map(mLayoutOptions, ({name, key, icon}) => (
                    <Tooltip text={name}>
                        <Button
                            key={key}
                            className="kt-layout-btn kt-tablayout"
                            isSmall
                            isPrimary={(tabsConfig.tabletLayout ? tabsConfig.tabletLayout : 'inherit') === key}
                            aria-pressed={(tabsConfig.tabletLayout ? tabsConfig.tabletLayout : 'inherit') === key}
                            onClick={() => saveConfigState('tabletLayout', key)}
                        >
                            {icon}
                        </Button>
                    </Tooltip>
                ))}
            </ButtonGroup>
        </Fragment>
    );
    const mobileControls = (
        <Fragment>
            <p className="components-base-control__label">{__('Mobile Layout', 'kadence-blocks')}</p>
            <ButtonGroup aria-label={__('Mobile Layout')}>
                {map(mLayoutOptions, ({name, key, icon}) => (
                    <Tooltip text={name}>
                        <Button
                            key={key}
                            className="kt-layout-btn kt-tablayout"
                            isSmall
                            isPrimary={(tabsConfig.mobileLayout ? tabsConfig.mobileLayout : 'inherit') === key}
                            aria-pressed={(tabsConfig.mobileLayout ? tabsConfig.mobileLayout : 'inherit') === key}
                            onClick={() => saveConfigState('mobileLayout', key)}
                        >
                            {icon}
                        </Button>
                    </Tooltip>
                ))}
            </ButtonGroup>
        </Fragment>
    );
    return (
        <Fragment>
            <Button className="kt-block-defaults" onClick={() => setIsOpen(true) }>
                <span className="kt-block-icon">{blockTabsIcon}</span>
                {__('Tabs')}
            </Button>
            {isOpen && (
                <Modal
                    className="kt-block-defaults-modal"
                    title={__('Kadence Tabs', 'kadence-blocks')}
                    onRequestClose={() => {
                        saveConfig('kadence/tabs', tabsConfig);
                    }}>
                    <ToggleControl
                        label={__('Show Presets', 'kadence-blocks')}
                        checked={(undefined !== tabsConfig.showPresets ? tabsConfig.showPresets : true)}
                        onChange={value => saveConfigState('showPresets', value)}
                    />
                    <TabPanel className="kt-inspect-tabs kt-spacer-tabs"
                              activeClass="active-tab"
                              tabs={[
                                  {
                                      name: 'desk',
                                      title: <Dashicon icon="desktop"/>,
                                      className: 'kt-desk-tab',
                                  },
                                  {
                                      name: 'tablet',
                                      title: <Dashicon icon="tablet"/>,
                                      className: 'kt-tablet-tab',
                                  },
                                  {
                                      name: 'mobile',
                                      title: <Dashicon icon="smartphone"/>,
                                      className: 'kt-mobile-tab',
                                  },
                              ]}>
                        {
                            (tab) => {
                                let tabout;
                                if (tab.name) {
                                    if ('mobile' === tab.name) {
                                        tabout = mobileControls;
                                    } else if ('tablet' === tab.name) {
                                        tabout = tabletControls;
                                    } else {
                                        tabout = deskControls;
                                    }
                                }
                                return <div>{tabout}</div>;
                            }
                        }
                    </TabPanel>
                    <SelectControl
                        label={__('Tab Title Alignment', 'kadence-blocks')}
                        value={(tabsConfig.tabAlignment ? tabsConfig.tabAlignment : 'left')}
                        options={[
                            {value: 'left', label: __('Left', 'kadence-blocks')},
                            {value: 'center', label: __('Center', 'kadence-blocks')},
                            {value: 'right', label: __('Right', 'kadence-blocks')},
                        ]}
                        onChange={value => saveConfigState('tabAlignment', value)}
                    />
                    <PanelBody
                        title={__('Content Settings', 'kadence-blocks')}
                        initialOpen={false}
                    >
                        <p className="kt-setting-label">{__('Content Background', 'kadence-blocks')}</p>
                        <PopColorControl
                            value={(tabsConfig.contentBgColor ? tabsConfig.contentBgColor : '')}
                            onChange={(value) => saveConfigState('contentBgColor', value)}
                        />
                        <MeasurementControls
                            label={__('Inner Content Padding (px)', 'kadence-blocks')}
                            measurement={(tabsConfig.innerPadding ? tabsConfig.innerPadding : [20, 20, 20, 20])}
                            control={(tabsConfig.innerPaddingControl ? tabsConfig.innerPaddingControl : 'linked')}
                            onChange={(value) => saveConfigState('innerPadding', value)}
                            onControl={(value) => saveConfigState('innerPaddingControl', value)}
                            min={0}
                            max={100}
                            step={1}
                        />
                        <p className="kt-setting-label">{__('Border Color', 'kadence-blocks')}</p>
                        <PopColorControl
                            value={(tabsConfig.contentBorderColor ? tabsConfig.contentBorderColor : '')}
                            onChange={(value) => saveConfigState('contentBorderColor', value)}
                        />
                        <MeasurementControls
                            label={__('Content Border Width (px)', 'kadence-blocks')}
                            measurement={(tabsConfig.contentBorder ? tabsConfig.contentBorder : [1, 1, 1, 1])}
                            control={(tabsConfig.contentBorderControl ? tabsConfig.contentBorderControl : 'linked')}
                            onChange={(value) => saveConfigState('contentBorder', value)}
                            onControl={(value) => saveConfigState('contentBorderControl', value)}
                            min={0}
                            max={100}
                            step={1}
                        />
                    </PanelBody>
                    <PanelBody
                        title={__('Tab Title Color Settings', 'kadence-blocks')}
                        initialOpen={false}
                    >
                        <TabPanel className="kt-inspect-tabs kt-no-ho-ac-tabs kt-hover-tabs"
                                  activeClass="active-tab"
                                  tabs={[
                                      {
                                          name: 'normal',
                                          title: __('Normal'),
                                          className: 'kt-normal-tab',
                                      },
                                      {
                                          name: 'hover',
                                          title: __('Hover'),
                                          className: 'kt-hover-tab',
                                      },
                                      {
                                          name: 'active',
                                          title: __('Active'),
                                          className: 'kt-active-tab',
                                      },
                                  ]}>
                            {
                                (tab) => {
                                    let tabout;
                                    if (tab.name) {
                                        if ('hover' === tab.name) {
                                            tabout = (
                                                <Fragment>
                                                    <p className="kt-setting-label">{__('Hover Color', 'kadence-blocks')}</p>
                                                    <PopColorControl
                                                        value={(tabsConfig.titleColorHover ? tabsConfig.titleColorHover : '')}
                                                        onChange={(value) => saveConfigState('titleColorHover', value)}
                                                    />
                                                    <p className="kt-setting-label">{__('Hover Background')}</p>
                                                    <PopColorControl
                                                        value={(tabsConfig.titleBgHover ? tabsConfig.titleBgHover : '')}
                                                        onChange={(value) => saveConfigState('titleBgHover', value)}
                                                    />
                                                    <p className="kt-setting-label">{__('Hover Border Color')}</p>
                                                    <PopColorControl
                                                        value={(tabsConfig.titleBorderHover ? tabsConfig.titleBorderHover : '')}
                                                        onChange={(value) => saveConfigState('titleBorderHover', value)}
                                                    />
                                                </Fragment>
                                            );
                                        } else if ('active' === tab.name) {
                                            tabout = (
                                                <Fragment>
                                                    <p className="kt-setting-label">{__('Active Color', 'kadence-blocks')}</p>
                                                    <PopColorControl
                                                        value={(tabsConfig.titleColorActive ? tabsConfig.titleColorActive : '')}
                                                        onChange={(value) => saveConfigState('titleColorActive', value)}
                                                    />
                                                    <p className="kt-setting-label">{__('Active Background', 'kadence-blocks')}</p>
                                                    <PopColorControl
                                                        value={(tabsConfig.titleBgActive ? tabsConfig.titleBgActive : '')}
                                                        onChange={(value) => saveConfigState('titleBgActive', value)}
                                                    />
                                                    <p className="kt-setting-label">{__('Active Border Color', 'kadence-blocks')}</p>
                                                    <PopColorControl
                                                        value={(tabsConfig.titleBorderActive ? tabsConfig.titleBorderActive : '')}
                                                        onChange={(value) => saveConfigState('titleBorderActive', value)}
                                                    />
                                                </Fragment>
                                            );
                                        } else {
                                            tabout = (
                                                <Fragment>
                                                    <p className="kt-setting-label">{__('Title Color', 'kadence-blocks')}</p>
                                                    <PopColorControl
                                                        value={(tabsConfig.titleColor ? tabsConfig.titleColor : '')}
                                                        onChange={(value) => saveConfigState('titleColor', value)}
                                                    />
                                                    <p className="kt-setting-label">{__('Title Background', 'kadence-blocks')}</p>
                                                    <PopColorControl
                                                        value={(tabsConfig.titleBg ? tabsConfig.titleBg : '')}
                                                        onChange={(value) => saveConfigState('titleBg', value)}
                                                    />
                                                    <p className="kt-setting-label">{__('Title Border Color', 'kadence-blocks')}</p>
                                                    <PopColorControl
                                                        value={(tabsConfig.titleBorder ? tabsConfig.titleBorder : '')}
                                                        onChange={(value) => saveConfigState('titleBorder', value)}
                                                    />
                                                </Fragment>
                                            );
                                        }
                                    }
                                    return <div>{tabout}</div>;
                                }
                            }
                        </TabPanel>
                    </PanelBody>
                    <PanelBody
                        title={__('Tab Title Spacing/Border', 'kadence-blocks')}
                        initialOpen={false}
                    >
                        <MeasurementControls
                            label={__('Title Padding (px)', 'kadence-blocks')}
                            measurement={(tabsConfig.titlePadding ? tabsConfig.titlePadding : [])}
                            control={(tabsConfig.titlePaddingControl ? tabsConfig.titlePaddingControl : 'linked')}
                            onChange={(value) => saveConfigState('titlePadding', value)}
                            onControl={(value) => saveConfigState('titlePaddingControl', value)}
                            min={0}
                            max={50}
                            step={1}
                        />
                        <MeasurementControls
                            label={__('Title Margin (px)', 'kadence-blocks')}
                            measurement={(tabsConfig.titleMargin ? tabsConfig.titleMargin : [])}
                            control={(tabsConfig.titleMarginControl ? tabsConfig.titleMarginControl : 'linked')}
                            onChange={(value) => saveConfigState('titleMargin', value)}
                            onControl={(value) => saveConfigState('titleMarginControl', value)}
                            min={-25}
                            max={25}
                            step={1}
                        />
                        <MeasurementControls
                            label={__('Title Border Width (px)', 'kadence-blocks')}
                            measurement={(tabsConfig.titleBorderWidth ? tabsConfig.titleBorderWidth : [])}
                            control={(tabsConfig.titleBorderControl ? tabsConfig.titleBorderControl : 'linked')}
                            onChange={(value) => saveConfigState('titleBorderWidth', value)}
                            onControl={(value) => saveConfigState('titleBorderControl', value)}
                            min={0}
                            max={20}
                            step={1}
                        />
                        <MeasurementControls
                            label={__('Title Border Radius (px)', 'kadence-blocks')}
                            measurement={(tabsConfig.titleBorderRadius ? tabsConfig.titleBorderRadius : [])}
                            control={(tabsConfig.titleBorderRadiusControl ? tabsConfig.titleBorderRadiusControl : 'linked')}
                            onChange={(value) => saveConfigState('titleBorderRadius', value)}
                            onControl={(value) => saveConfigState('titleBorderRadiusControl', value)}
                            min={0}
                            max={50}
                            step={1}
                            controlTypes={[
                                {key: 'linked', name: __('Linked', 'kadence-blocks'), icon: radiusLinkedIcon},
                                {
                                    key: 'individual',
                                    name: __('Individual', 'kadence-blocks'),
                                    icon: radiusIndividualIcon
                                },
                            ]}
                            firstIcon={topLeftIcon}
                            secondIcon={topRightIcon}
                            thirdIcon={bottomRightIcon}
                            fourthIcon={bottomLeftIcon}
                        />
                    </PanelBody>
                    <PanelBody
                        title={__('Tab Title Font Settings', 'kadence-blocks')}
                        initialOpen={false}
                    >
                        <TypographyControls
                            fontFamily={(tabsConfig.typography ? tabsConfig.typography : '')}
                            onFontFamily={(value) => saveConfigState('typography', value)}
                            googleFont={(tabsConfig.googleFont ? tabsConfig.googleFont : false)}
                            onFontChange={(select) => {
                                saveConfigState('typography', select.value);
                                saveConfigState('googleFont', select.google);
                            }}
                            onGoogleFont={(value) => saveConfigState('googleFont', value)}
                            loadGoogleFont={(tabsConfig.loadGoogleFont ? tabsConfig.loadGoogleFont : true)}
                            onLoadGoogleFont={(value) => saveConfigState('loadGoogleFont', value)}
                            fontVariant={(tabsConfig.fontVariant ? tabsConfig.fontVariant : '')}
                            onFontVariant={(value) => saveConfigState('fontVariant', value)}
                            fontWeight={(tabsConfig.fontWeight ? tabsConfig.fontWeight : '')}
                            onFontWeight={(value) => saveConfigState('fontWeight', value)}
                            fontStyle={(tabsConfig.fontStyle ? tabsConfig.fontStyle : '')}
                            onFontStyle={(value) => saveConfigState('fontStyle', value)}
                            fontSubset={(tabsConfig.fontSubset ? tabsConfig.fontSubset : '')}
                            onFontSubset={(value) => saveConfigState('fontSubset', value)}
                        />
                        <h2 className="kt-heading-size-title">{__('Size Controls', 'kadence-blocks')}</h2>
                        <TabPanel className="kt-size-tabs"
                                  activeClass="active-tab"
                                  tabs={[
                                      {
                                          name: 'desk',
                                          title: <Dashicon icon="desktop"/>,
                                          className: 'kt-desk-tab',
                                      },
                                      {
                                          name: 'tablet',
                                          title: <Dashicon icon="tablet"/>,
                                          className: 'kt-tablet-tab',
                                      },
                                      {
                                          name: 'mobile',
                                          title: <Dashicon icon="smartphone"/>,
                                          className: 'kt-mobile-tab',
                                      },
                                  ]}>
                            {
                                (tab) => {
                                    let tabout;
                                    if (tab.name) {
                                        if ('mobile' === tab.name) {
                                            tabout = (
                                                <PanelBody>
                                                    <ButtonGroup className="kt-size-type-options"
                                                                 aria-label={__('Size Type', 'kadence-blocks')}>
                                                        {map(sizeTypes, ({name, key}) => (
                                                            <Button
                                                                key={key}
                                                                className="kt-size-btn"
                                                                isSmall
                                                                isPrimary={(tabsConfig.sizeType ? tabsConfig.sizeType : 'px') === key}
                                                                aria-pressed={(tabsConfig.sizeType ? tabsConfig.sizeType : 'px') === key}
                                                                onClick={() => saveConfigState('sizeType', key)}
                                                            >
                                                                {name}
                                                            </Button>
                                                        ))}
                                                    </ButtonGroup>
                                                    <RangeControl
                                                        label={__('Mobile Font Size', 'kadence-blocks')}
                                                        value={(tabsConfig.mobileSize ? tabsConfig.mobileSize : '')}
                                                        onChange={(value) => saveConfigState('mobileSize', value)}
                                                        min={fontMin}
                                                        max={fontMax}
                                                        step={fontStep}
                                                    />
                                                    <ButtonGroup className="kt-size-type-options"
                                                                 aria-label={__('Size Type', 'kadence-blocks')}>
                                                        {map(sizeTypes, ({name, key}) => (
                                                            <Button
                                                                key={key}
                                                                className="kt-size-btn"
                                                                isSmall
                                                                isPrimary={(tabsConfig.lineType ? tabsConfig.lineType : 'px') === key}
                                                                aria-pressed={(tabsConfig.lineType ? tabsConfig.lineType : 'px') === key}
                                                                onClick={() => saveConfigState('lineType', key)}
                                                            >
                                                                {name}
                                                            </Button>
                                                        ))}
                                                    </ButtonGroup>
                                                    <RangeControl
                                                        label={__('Mobile Line Height', 'kadence-blocks')}
                                                        value={(tabsConfig.mobileLineHeight ? tabsConfig.mobileLineHeight : '')}
                                                        onChange={(value) => saveConfigState('mobileLineHeight', value)}
                                                        min={lineMin}
                                                        max={lineMax}
                                                        step={lineStep}
                                                    />
                                                </PanelBody>
                                            );
                                        } else if ('tablet' === tab.name) {
                                            tabout = (
                                                <PanelBody>
                                                    <ButtonGroup className="kt-size-type-options"
                                                                 aria-label={__('Size Type')}>
                                                        {map(sizeTypes, ({name, key}) => (
                                                            <Button
                                                                key={key}
                                                                className="kt-size-btn"
                                                                isSmall
                                                                isPrimary={(tabsConfig.sizeType ? tabsConfig.sizeType : 'px') === key}
                                                                aria-pressed={(tabsConfig.sizeType ? tabsConfig.sizeType : 'px') === key}
                                                                onClick={() => saveConfigState('sizeType', key)}
                                                            >
                                                                {name}
                                                            </Button>
                                                        ))}
                                                    </ButtonGroup>
                                                    <RangeControl
                                                        label={__('Tablet Font Size', 'kadence-blocks')}
                                                        value={(tabsConfig.tabSize ? tabsConfig.tabSize : '')}
                                                        onChange={(value) => saveConfigState('tabSize', value)}
                                                        min={fontMin}
                                                        max={fontMax}
                                                        step={fontStep}
                                                    />
                                                    <ButtonGroup className="kt-size-type-options"
                                                                 aria-label={__('Size Type', 'kadence-blocks')}>
                                                        {map(sizeTypes, ({name, key}) => (
                                                            <Button
                                                                key={key}
                                                                className="kt-size-btn"
                                                                isSmall
                                                                isPrimary={(tabsConfig.lineType ? tabsConfig.lineType : 'px') === key}
                                                                aria-pressed={(tabsConfig.lineType ? tabsConfig.lineType : 'px') === key}
                                                                onClick={() => saveConfigState('lineType', key)}
                                                            >
                                                                {name}
                                                            </Button>
                                                        ))}
                                                    </ButtonGroup>
                                                    <RangeControl
                                                        label={__('Tablet Line Height', 'kadence-blocks')}
                                                        value={(tabsConfig.tabLineHeight ? tabsConfig.tabLineHeight : '')}
                                                        onChange={(value) => saveConfigState('tabLineHeight', value)}
                                                        min={lineMin}
                                                        max={lineMax}
                                                        step={lineStep}
                                                    />
                                                </PanelBody>
                                            );
                                        } else {
                                            tabout = (
                                                <PanelBody>
                                                    <ButtonGroup className="kt-size-type-options"
                                                                 aria-label={__('Size Type', 'kadence-blocks')}>
                                                        {map(sizeTypes, ({name, key}) => (
                                                            <Button
                                                                key={key}
                                                                className="kt-size-btn"
                                                                isSmall
                                                                isPrimary={(tabsConfig.sizeType ? tabsConfig.sizeType : 'px') === key}
                                                                aria-pressed={(tabsConfig.sizeType ? tabsConfig.sizeType : 'px') === key}
                                                                onClick={() => saveConfigState('sizeType', key)}
                                                            >
                                                                {name}
                                                            </Button>
                                                        ))}
                                                    </ButtonGroup>
                                                    <RangeControl
                                                        label={__('Font Size', 'kadence-blocks')}
                                                        value={(tabsConfig.size ? tabsConfig.size : '')}
                                                        onChange={(value) => saveConfigState('size', value)}
                                                        min={fontMin}
                                                        max={fontMax}
                                                        step={fontStep}
                                                    />
                                                    <ButtonGroup className="kt-size-type-options"
                                                                 aria-label={__('Size Type', 'kadence-blocks')}>
                                                        {map(sizeTypes, ({name, key}) => (
                                                            <Button
                                                                key={key}
                                                                className="kt-size-btn"
                                                                isSmall
                                                                isPrimary={(tabsConfig.lineType ? tabsConfig.lineType : 'px') === key}
                                                                aria-pressed={(tabsConfig.lineType ? tabsConfig.lineType : 'px') === key}
                                                                onClick={() => saveConfigState('lineType', key)}
                                                            >
                                                                {name}
                                                            </Button>
                                                        ))}
                                                    </ButtonGroup>
                                                    <RangeControl
                                                        label={__('Line Height', 'kadence-blocks')}
                                                        value={(tabsConfig.lineHeight ? tabsConfig.lineHeight : '')}
                                                        onChange={(value) => saveConfigState('lineHeight', value)}
                                                        min={lineMin}
                                                        max={lineMax}
                                                        step={lineStep}
                                                    />
                                                </PanelBody>
                                            );
                                        }
                                    }
                                    return <div>{tabout}</div>;
                                }
                            }
                        </TabPanel>
                        <RangeControl
                            label={__('Letter Spacing', 'kadence-blocks')}
                            value={(tabsConfig.letterSpacing ? tabsConfig.letterSpacing : '')}
                            onChange={(value) => saveConfigState('letterSpacing', value)}
                            min={-5}
                            max={15}
                            step={0.1}
                        />
                    </PanelBody>
                    <PanelBody
                        title={__('Structure Settings', 'kadence-blocks')}
                        initialOpen={false}
                    >
                        <RangeControl
                            label={__('Content Minimum Height', 'kadence-blocks')}
                            value={(tabsConfig.minHeight ? tabsConfig.minHeight : '')}
                            onChange={(value) => saveConfigState('minHeight', value)}
                            min={0}
                            max={1000}
                        />
                        <RangeControl
                            label={__('Max Width', 'kadence-blocks')}
                            value={(tabsConfig.maxWidth ? tabsConfig.maxWidth : '')}
                            onChange={(value) => saveConfigState('maxWidth', value)}
                            min={0}
                            max={2000}
                        />
                    </PanelBody>
                    <Button className="kt-defaults-save" isPrimary onClick={() => {
                        saveConfig('kadence/tabs', tabsConfig);
                    }}>
                        {__('Save/Close', 'kadence-blocks')}
                    </Button>
                </Modal>
            )}
        </Fragment>
    );
}

export default KadenceTabsDefault;
