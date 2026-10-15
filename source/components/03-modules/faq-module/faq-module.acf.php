<?php

function getFaqModuleFields(int $id, int $k): void
{
	$buttonData = getLinkArray(getPageBuilderFields($id, $k, 'button') ?: '', '', 'button');
	$rows = [];
	$rowCount = (int) getPageBuilderFields($id, $k, 'rows');

	for ($i = 0; $i < $rowCount; $i++) {
		$rowPrefix = 'rows_' . $i;
		$accordions = [];
		$accordionCount = (int) getPageBuilderFields($id, $k, $rowPrefix . '_accordions');

		for ($j = 0; $j < $accordionCount; $j++) {
			$accordionPrefix = $rowPrefix . '_accordions_' . $j;
			$items = [];
			$itemCount = (int) getPageBuilderFields($id, $k, $accordionPrefix . '_items');

			for ($l = 0; $l < $itemCount; $l++) {
				$itemPrefix = $accordionPrefix . '_items_' . $l;
				$items[] = [
					'text__left' => getPageBuilderFields($id, $k, $itemPrefix . '_left'),
					'text__right' => getPageBuilderFields($id, $k, $itemPrefix . '_right'),
				];
			}

			$accordions[] = [
				'text__title' => getPageBuilderFields($id, $k, $accordionPrefix . '_title'),
				'wysiwyg__text' => applyContentFilter(getPageBuilderFields($id, $k, $accordionPrefix . '_text')),
				'repeater__items' => $items,
			];
		}

		$rows[] = [
			'text__id' => sanitize_title(getPageBuilderFields($id, $k, $rowPrefix . '_title')),
			'text__title' => getPageBuilderFields($id, $k, $rowPrefix . '_title'),
			'repeater__accordions' => $accordions,
		];
	}

	Twig::renderWithAttrs(
		'/03-modules/faq-module/faq-module.twig',
		[
			'faq_module' => [
				...$buttonData,
				'select__variation' => getPageBuilderFields($id, $k, 'variation') ?: 'default',
				'text__super_title' => getPageBuilderFields($id, $k, 'super_title'),
				'text__title' => getPageBuilderFields($id, $k, 'title'),
				'text__text' => getPageBuilderFields($id, $k, 'text'),
				'repeater__rows' => $rows,
				'boolean__dark' => (bool) getPageBuilderFields($id, $k, 'dark'),
			],
		],
		$id,
		$k
	);
}
