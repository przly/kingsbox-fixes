<?php


use shop\product\ProductsHelpers;

function getProductCardSliderFields(int $id, int $k): void
{
	$relationship = getPageBuilderFields($id, $k, 'product_relationship');
	$relationshipItems = is_array($relationship)
		&& (array_key_exists('ID', $relationship) || array_key_exists('id', $relationship))
		? [$relationship]
		: (is_array($relationship) ? $relationship : [$relationship]);
	$relationshipIds = [];

	foreach ($relationshipItems as $relationshipItem) {
		if ($relationshipItem instanceof WP_Post) {
			$relationshipItem = $relationshipItem->ID;
		} elseif (is_array($relationshipItem)) {
			$relationshipItem = $relationshipItem['ID'] ?? $relationshipItem['id'] ?? 0;
		} elseif (is_object($relationshipItem)) {
			$relationshipItem = $relationshipItem->ID ?? $relationshipItem->id ?? 0;
		}

		$relationshipItem = (int) $relationshipItem;
		if ($relationshipItem) {
			$relationshipIds[] = $relationshipItem;
		}
	}
	$relationshipIds = array_values(array_unique($relationshipIds));

	$category = getPageBuilderFields($id, $k, 'product_category');
	$categoryId = is_object($category)
		? (int) ($category->term_id ?? $category->ID ?? 0)
		: (int) (is_array($category) ? ($category['term_id'] ?? $category['ID'] ?? $category['id'] ?? 0) : $category);
	$postIds = [];

	if ($relationshipIds !== []) {
		$query = new WP_Query([
			'post_type' => 'product',
			'post_status' => 'publish',
			'post__in' => $relationshipIds,
			'orderby' => 'post__in',
			'posts_per_page' => -1,
			'fields' => 'ids',
			'no_found_rows' => true,
			'lang' => FRONT_LANGUAGE,
		]);
		$postIds = is_array($query->posts) ? $query->posts : [];
	} elseif ($categoryId) {
		$query = new WP_Query([
			'post_type' => 'product',
			'post_status' => 'publish',
			'tax_query' => [
				[
					'taxonomy' => 'product_cat',
					'field' => 'term_id',
					'terms' => $categoryId,
				],
			],
			'orderby' => 'date',
			'order' => 'DESC',
			'posts_per_page' => -1,
			'fields' => 'ids',
			'no_found_rows' => true,
			'lang' => FRONT_LANGUAGE,
		]);
		$postIds = is_array($query->posts) ? $query->posts : [];
	}

	$itemsArray = [];
	foreach ($postIds as $post) {
		$postId = $post instanceof WP_Post ? (int) $post->ID : (int) $post;
		if (!$postId) {
			continue;
		}

		$productCard = ProductsHelpers::buildProductCard($postId);
		if (!$productCard || empty($productCard['repeater__images'])) {
			continue;
		}

		$itemsArray[] = [
			'link__link' => $productCard['link__link'] ?? '',
			'link_target' => $productCard['link_target'] ?? '',
			'link_rel' => $productCard['link_rel'] ?? '',
			'repeater__images' => $productCard['repeater__images'] ?? [],
			'image__hover_image' => $productCard['image__hover_image'] ?? '',
			'hover_image_alt' => $productCard['hover_image_alt'] ?? '',
			'top_tag' => $productCard['top_tag'] ?? [],
			'bottom_tag' => $productCard['bottom_tag'] ?? [],
			'variations_tag' => $productCard['variations_tag'] ?? [],
			'text__title' => $productCard['text__title'] ?? '',
			'text__price' => $productCard['text__price'] ?? '',
			'text__price_slashed' => $productCard['text__price_slashed'] ?? '',
			'text__discount' => $productCard['text__discount'] ?? '',
			'text__lowest_price' => $productCard['text__lowest_price'] ?? '',
		];
	}

	$moduleLink = getPageBuilderFields($id, $k, 'link');
	$moduleLink = is_string($moduleLink)
		|| (is_array($moduleLink) && isset($moduleLink['url']))
		? $moduleLink
		: '';
	$linkArray = getLinkArray($moduleLink);
	$linkArray = [
		'link__link' => $linkArray['link__link'] ?? '',
		'link_text' => $linkArray['link_text'] ?? '',
		'link_target' => $linkArray['link_target'] ?? '',
		'link_rel' => $linkArray['link_rel'] ?? '',
	];

	Twig::renderWithAttrs(
		'/03-modules/product-card-slider/product-card-slider.twig',
		[
			'product_card_slider' => [
				...$linkArray,
				'boolean__dark_bg' => (bool) getPageBuilderFields($id, $k, 'dark_bg'),
				'text__title' => (string) getPageBuilderFields($id, $k, 'title'),
				'repeater__items' => $itemsArray,
			],
		],
		$id,
		$k
	);
}
