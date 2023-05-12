<?php
/**
 * Class to Build the Advanced Form Number Input Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Kadence_Blocks_Number_Input_Block extends Kadence_Blocks_Advanced_Form_Input_Block {

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
	protected $block_name = 'number';


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
	 * Return dynamically generated HTML for block
	 *
	 * @param $attributes
	 * @param $unique_id
	 * @param $content
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 *
	 * @return mixed
	 */
	public function build_html( $attributes, $unique_id, $content, $block_instance ) {
		$type = 'number';
		$is_required = $this->is_required( $attributes );
		$min = isset( $attributes['minValue'] ) && $attributes['minValue'] !== '' ? ' min="' . $attributes['minValue']  . '" ' : '';
		$max = isset( $attributes['maxValue'] ) && $attributes['maxValue'] !== '' ? ' max="' . $attributes['maxValue']  . '" ' : '';
		$outer_classes = array( 'kb-adv-form-field', 'kb-field' . $unique_id );
		if ( ! empty( $attributes['className'] ) ) {
			$outer_classes[] = $attributes['className'];
		}
		$wrapper_args = array(
			'class' => implode( ' ', $outer_classes ),
		);
		$wrapper_attributes = get_block_wrapper_attributes( $wrapper_args );
		$inner_content  = '';
		$inner_content .= $this->field_label( $attributes );
		$inner_content .= $this->field_aria_label( $attributes );
		$inner_content .= '<input name="' . $this->field_name( $attributes ) . '" id="' . $this->field_id( $attributes ) . '"' . $min . $max . $this->aria_described_by( $attributes ) . ' data-label="' . esc_attr( $this->get_label( $attributes ) ) . '"' . $this->get_auto_complete( $attributes ) . ' type="' . $type . '" placeholder="' . $this->get_placeholder( $attributes ) . '" value="' . esc_attr( $this->get_default( $attributes ) ) . '" data-type="' . $type . '" class="kb-field kb-' . $type . '-field" data-required="' . $is_required . '" />';

		$inner_content .= $this->field_help_text( $attributes );

		$content = sprintf( '<div %1$s>%2$s</div>', $wrapper_attributes, $inner_content );
		return $content;
	}
}

Kadence_Blocks_Number_Input_Block::get_instance();