<?php

function getCategoriesModuleFields(int $id, int $k): void
{
	$itemsArray = [];
	$repeaterItems = (int) getPageBuilderFields($id, $k, 'items');

	for ($i = 0; $i < $repeaterItems; $i++) {
		$link = getPageBuilderFields($id, $k, 'items_' . $i . '_link');
		$link = is_array($link) ? $link : [];
		$imageId = (int) getPageBuilderFields($id, $k, 'items_' . $i . '_image');

		$itemsArray[] = [
			'link__link' => $link['url'] ?? '',
			'link_target' => $link['target'] ?? '',
			'link_rel' => $link['rel'] ?? '',
			'text__title' => getPageBuilderFields($id, $k, 'items_' . $i . '_title'),
			'image__image' => $imageId ? getImgUrlFromImageID($imageId) : '',
			'image_alt' => $imageId ? getImgAltFromImageID($imageId) : '',
		];
	}

	Twig::renderWithAttrs(
		'/03-modules/categories-module/categories-module.twig',
		[
			'categories_module' => [
				'text__title' => getPageBuilderFields($id, $k, 'title'),
				'repeater__items' => $itemsArray,
			],
		],
		$id,
		$k
	);
}
