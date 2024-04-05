<?php
/**
 * Class to Build the Header Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Header Block.
 *
 * @category class
 */
class Kadence_Blocks_Header_Block extends Kadence_Blocks_Abstract_Block {

	/**
	 * Instance of this class
	 *
	 * @var null
	 */
	private static $instance = null;

	/**
	 * Block name within this namespace.
	 *
	 * @var string
	 */
	protected $block_name = 'header';

	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_script = true;

	/**
	 * Instance of this class
	 *
	 * @var null
	 */
	private static $seen_refs = array();

	protected $header_attributes = array();

	/**
	 * Instance Control
	 */
	public static function get_instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Builds CSS for block.
	 *
	 * @param array              $attributes      the blocks attributes.
	 * @param Kadence_Blocks_CSS $css             the css class for blocks.
	 * @param string             $unique_id       the blocks attr ID.
	 * @param string             $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {
		$header_attributes = $this->get_header_attributes( $attributes['id'] );


		$css->set_style_id( 'kb-' . $this->block_name . $unique_style_id );

		$sizes = array( 'Desktop', 'Tablet', 'Mobile' );

		foreach ( $sizes as $size ) {
			$this->sized_dynamic_styles( $css, $header_attributes, $unique_id, $size );
		}
		$css->set_media_state( 'desktop' );


//		$css->add_property('color', $css->render_color($header_attributes['textColor']));
//		$css->add_property('font-size', $css->get_font_size($typography['size'][0], $typography['sizeType']));
//		$css->add_property('text-transform', $typography['textTransform']);
//		$css->add_property('letter-spacing', $typography['letterSpacing'][0] . $typography['letterType'] );
	// 	$css->add_property('border-top-width', '' );
	// $css->add_property('border-top-style', $border['top'] . 'px');
	// $css->add_property('border-top-color', previewBorderColorTop);
	// $css->add_property('border-right-width', previewBorderRight);
	// $css->add_property('border-right-style', previewBorderStyleRight);
	// $css->add_property('border-right-color', previewBorderColorRight);
	// $css->add_property('border-bottom-width', previewBorderBottom);
	// $css->add_property('border-bottom-style', previewBorderStyleBottom);
	// $css->add_property('border-bottom-color', previewBorderColorBottom);
	// $css->add_property('border-left-width', previewBorderLeft);
	// $css->add_property('border-left-style', previewBorderStyleLeft);
	// $css->add_property('border-left-color', previewBorderColorLeft);

		//$css->set_selector('.wp-block-kadence-header.wp-block-kadence-header' . $unique_id . ':hover');
		//$css->add_property('background-color', $css->render_color($hover_bg['color']));
		$css->set_selector('.wp-block-kadence-header.wp-block-kadence-header' . $unique_id . ' a');
//		$css->add_property('color', $css->render_color($header_attributes['linkColor']));
		$css->set_selector('.wp-block-kadence-header.wp-block-kadence-header' . $unique_id . ' a:hover');
//		$css->add_property('color', $css->render_color($header_attributes['linkHoverColor']));

		return $css->css_output();
	}

	/**
	 * Build up the dynamic styles for a size.
	 *
	 * @param string $size The size.
	 * @return array
	 */
	public function sized_dynamic_styles( $css, $attributes, $unique_id, $size = 'Desktop' ) {
		$sized_attributes = $css->get_sized_attributes_auto( $attributes, $size, false );
		$sized_attributes_inherit = $css->get_sized_attributes_auto( $attributes, $size );

		$css->set_media_state( strtolower( $size ) );

		$css->set_selector( '.wp-block-kadence-header' . $unique_id );

		$bg = $sized_attributes['background'];
		$hover_bg = $sized_attributes['backgroundHover'];
		$border = $sized_attributes['border'];
		$typography = $sized_attributes['typography'];

		if ( $sized_attributes['style'] != 'transparent' ) {
			$css->add_property('background-color', $css->render_color( ! empty($bg['color']) ? $bg['color'] : ''));
			//$css->render_border_styles($border, 'border');
			if('' !== $bg && 'normal' === $bg['type'] && ! empty($bg['image'])) {
				$css->add_property('background-image', 'url("' . $bg['image'] . '")');
				$css->add_property('background-position', $bg['position']);
				$css->add_property('background-size', $bg['size']);
				$css->add_property('background-repeat', $bg['repeat']);
				$css->add_property('background-attachment', $bg['attachment']);
			}
		}

		if ( $sized_attributes['style'] == 'transparent' ) {
			$css->add_property( 'top', '0px' );
		}
	}

	/**
	 * Build HTML for dynamic blocks
	 *
	 * @param          $attributes
	 * @param          $unique_id
	 * @param          $content
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 *
	 * @return mixed
	 */
	public function build_html( $attributes, $unique_id, $content, $block_instance ) {
		$header_block = get_post( $attributes['id'] );

		if ( ! $header_block || 'kadence_header' !== $header_block->post_type ) {
			return '';
		}

		if ( 'publish' !== $header_block->post_status || ! empty( $header_block->post_password ) ) {
			return '';
		}

		// Prevent a nav block from being rendered inside itself.
		if ( isset( self::$seen_refs[ $attributes['id'] ] ) ) {
			// WP_DEBUG_DISPLAY must only be honored when WP_DEBUG. This precedent
			// is set in `wp_debug_mode()`.
			$is_debug = WP_DEBUG && WP_DEBUG_DISPLAY;

			return $is_debug ?
				// translators: Visible only in the front end, this warning takes the place of a faulty block.
				__( '[block rendering halted]', 'kadence-blocks' ) :
				'';
		}
		self::$seen_refs[ $attributes['id'] ] = true;

		$header_attributes = $this->get_header_attributes( $attributes['id'] );
		$header_attributes = json_decode( json_encode( $header_attributes ), true );

		// Remove the advanced nav block so it doesn't try and render.
		$content = preg_replace( '/<!-- wp:kadence\/header {.*?} -->/', '', $header_block->post_content );
		$content = str_replace( '<!-- wp:kadence/header  -->', '', $content );
		$content = str_replace( '<!-- wp:kadence/header -->', '', $content );
		$content = str_replace( '<!-- /wp:kadence/header -->', '', $content );

		// Handle embeds for nav block.
		global $wp_embed;
		$content = $wp_embed->run_shortcode( $content );
		$content = $wp_embed->autoembed( $content );
		$content = do_blocks( $content );

		unset( self::$seen_refs[ $attributes['id'] ] );

//		$header_attributes = $this->get_header_attributes( $attributes['id'] );
//		$header_attributes = json_decode( json_encode( $header_attributes ), true );

		$name = ! empty( $attributes['name'] ) ? $attributes['name'] : '';


		// Inherit values.
		// Just getting a css class for access to methods.
		$css = Kadence_Blocks_CSS::get_instance();
		$style = $css->get_inherited_value( $header_attributes['style'], $header_attributes['styleTablet'], $header_attributes['styleMobile'], 'Desktop' );
		$style_tablet = $css->get_inherited_value( $header_attributes['style'], $header_attributes['styleTablet'], $header_attributes['styleMobile'], 'Tablet' );
		$style_mobile = $css->get_inherited_value( $header_attributes['style'], $header_attributes['styleTablet'], $header_attributes['styleMobile'], 'Mobile' );

		$wrapper_classes = array( 'wp-block-kadence-header' . $unique_id );
		$wrapper_classes[] = 'header-desktop-style-' . ( $style ? $style : 'standard' );
		$wrapper_classes[] = 'header-tablet-style-' . ( $style_tablet ? $style_tablet : 'standard' );
		$wrapper_classes[] = 'header-mobile-style-' . ( $style_mobile ? $style_mobile : 'standard' );

		$wrapper_attributes = get_block_wrapper_attributes(
			array(
				'class'      => implode( ' ', $wrapper_classes ),
				'aria-label' => $name,
			)
		);

		return sprintf(
			'<div %1$s>%2$s</div>',
			$wrapper_attributes,
			$content
		);
	}

	/**
	 * Get header attributes.
	 *
	 * @param int $post_id Post ID.
	 * @return array
	 */
	private function get_header_attributes( $post_id ) {

		if ( ! empty( $this->header_attributes[ $post_id ] ) ) {
			return $this->header_attributes[ $post_id ];
		}

		$post_meta = get_post_meta( $post_id );
		$header_meta = array();
		if ( is_array( $post_meta ) ) {
			foreach ( $post_meta as $meta_key => $meta_value ) {
				if ( strpos( $meta_key, '_kad_header_' ) === 0 && isset( $meta_value[0] ) ) {
					$header_meta[ str_replace( '_kad_header_', '', $meta_key ) ] = maybe_unserialize( $meta_value[0] );
				}
			}
		}

		$header_meta = $this->merge_defaults( $header_meta );

		if ( $this->header_attributes[ $post_id ] = $header_meta ) {
			return $this->header_attributes[ $post_id ];
		}

		return array();
	}


	/**
	 * Merges in default values from the cpt registration to the meta attributes from the database.
	 *
	 * @param array $attributes The database attribtues.
	 * @return array
	 */
	private function merge_defaults( $attributes ) {
		$meta_keys = get_registered_meta_keys( 'post', 'kadence_header' );
		$meta_prefix = '_kad_header_';
		$default_attributes = array();

		foreach ( $meta_keys as $key => $value ) {
			if ( str_starts_with( $key, $meta_prefix ) && array_key_exists( 'default', $value ) ) {
				$attr_name = str_replace( $meta_prefix, '', $key );

				//handle types of attributes that are an array with a single object that actually contains the actual attributes
				if ( is_array( $value['default'] ) && count( $value['default'] ) == 1 && isset( $value['default'][0] ) ) {
					if ( isset( $attributes[ $attr_name ] ) && is_array( $attributes[ $attr_name ] ) && count( $attributes[ $attr_name ] ) == 1 && isset( $attributes[ $attr_name ][0] ) ) {
						$attributes[ $attr_name ][0] = array_merge( $value['default'][0], $attributes[ $attr_name ][0] );
					}
				}

				//standard case
				$default_attributes[ $attr_name ] = $value['default'];
			}
		}

		return array_merge( $default_attributes, $attributes );
	}
}

Kadence_Blocks_Header_Block::get_instance();