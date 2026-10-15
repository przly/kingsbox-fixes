<?php

use shop\product\ProductsHelpers;

function getMainProductsFields(int $id, int $k): void
{
	$selectedProducts = (array) getPageBuilderFields($id, $k, 'product_selector');
	$selectedProductIds = array_values(array_unique(array_filter(array_map(
		static fn($productId): int => (int) $productId,
		$selectedProducts
	))));
	$category = getPageBuilderFields($id, $k, 'product_category');
	$categoryId = is_object($category)
		? (int) ($category->term_id ?? $category->ID ?? $category->id ?? 0)
		: (int) (is_array($category) ? ($category['term_id'] ?? $category['ID'] ?? $category['id'] ?? 0) : $category);

	$queryArgs = [
		'post_type' => 'product',
		'post_status' => 'publish',
		'posts_per_page' => -1,
		'fields' => 'ids',
		'no_found_rows' => true,
		'lang' => FRONT_LANGUAGE,
	];
	if ($selectedProductIds !== []) {
		$queryArgs['post__in'] = $selectedProductIds;
		$queryArgs['orderby'] = 'post__in';
	} elseif ($categoryId) {
		$queryArgs['tax_query'] = [
			[
				'taxonomy' => 'product_cat',
				'field' => 'term_id',
				'terms' => $categoryId,
			],
		];
		$queryArgs['orderby'] = 'date';
		$queryArgs['order'] = 'DESC';
	}

	$productIds = isset($queryArgs['orderby']) ? (new WP_Query($queryArgs))->posts : [];
	$productIds = is_array($productIds) ? $productIds : [];
	$cardDefaults = [
		'link__link' => '',
		'link_target' => '',
		'link_rel' => '',
		'repeater__images' => [],
		'image__hover_image' => '',
		'hover_image_alt' => '',
		'top_tag' => [],
		'bottom_tag' => [],
		'variations_tag' => [],
		'text__title' => '',
		'text__price' => '',
		'text__price_slashed' => '',
		'text__discount' => '',
		'text__lowest_price' => '',
	];
	$cards = [];

	foreach ($productIds as $product) {
		$productId = $product instanceof WP_Post ? (int) $product->ID : (int) $product;
		if (!$productId) {
			continue;
		}

		$productCard = ProductsHelpers::buildProductCard($productId);
		if (!$productCard || empty($productCard['repeater__images'])) {
			continue;
		}

		$cards[] = array_replace($cardDefaults, array_intersect_key($productCard, $cardDefaults));
	}

	$viewAllButton = getPageBuilderFields($id, $k, 'view_all_button');
	$viewAllButton = is_string($viewAllButton)
		|| (is_array($viewAllButton) && isset($viewAllButton['url']))
		? $viewAllButton
		: '';
	$viewAllButtonData = getLinkArray($viewAllButton, '', 'view_all_button');
	$viewAllButtonData = [
		'link__view_all_button' => $viewAllButtonData['link__view_all_button'] ?? '',
		'view_all_button_text' => $viewAllButtonData['view_all_button_text'] ?? '',
		'view_all_button_target' => $viewAllButtonData['view_all_button_target'] ?? '',
		'view_all_button_rel' => $viewAllButtonData['view_all_button_rel'] ?? '',
	];

	$link = getPageBuilderFields($id, $k, 'link');
	$link = is_string($link) || (is_array($link) && isset($link['url'])) ? $link : '';
	$linkData = getLinkArray($link);
	$linkData = [
		'link__link' => $linkData['link__link'] ?? '',
		'link_text' => $linkData['link_text'] ?? '',
		'link_target' => $linkData['link_target'] ?? '',
		'link_rel' => $linkData['link_rel'] ?? '',
	];

	Twig::renderWithAttrs(
		'/03-modules/main-products/main-products.twig',
		[
			'main_products' => [
				...$viewAllButtonData,
				...$linkData,
				'text__super_title' => getPageBuilderFields($id, $k, 'super_title'),
				'textarea__main_title' => getPageBuilderFields($id, $k, 'main_title'),
				'text__title' => getPageBuilderFields($id, $k, 'title'),
				'repeater__cards' => $cards,
			],
		],
		$id,
		$k
	);
}
