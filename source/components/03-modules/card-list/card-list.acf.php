<?php

function getCardListFields(int $id, int $k): void
{
	$cardsArray = [];
	$repeaterCards = (int) getPageBuilderFields($id, $k, 'cards');
	for ($i = 0; $i < $repeaterCards; $i++) {
		$icon = (int) getPageBuilderFields($id, $k, 'cards_' . $i . '_icon');
		$link = getPageBuilderFields($id, $k, 'cards_' . $i . '_link');

		$cardsArray[] = [
			'image__icon' => getImgUrlFromImageID($icon, 'w_400'),
			'image_icon_alt' => getImgAltFromImageID($icon),
			'textarea__title' => nl2br(getPageBuilderFields($id, $k, 'cards_' . $i . '_title')),
			'text__text' => getPageBuilderFields($id, $k, 'cards_' . $i . '_text'),
			'link__link' => $link['url'] ?? '',
			'link_text' => $link['title'] ?? '',
			'boolean__download_modal_trigger' => (bool) getPageBuilderFields(
				$id,
				$k,
				'cards_' . $i . '_download_modal_trigger'
			),
		];
	}
	Twig::renderWithAttrs(
		'/03-modules/card-list/card-list.twig',
		[
			'card_list' => [
				'repeater__cards' => $cardsArray,
				'download_modal' => getDownloadModal(),
			],
		],
		$id,
		$k
	);
}
