<?php

function getCaseStudyVideoFields(int $id, int $k): void
{
	$videoPosterId = (int) getPageBuilderFields($id, $k, 'video_poster');
	$videoMp4Id = (int) getPageBuilderFields($id, $k, 'video_mp4');
	$cardsArray = [];
	$repeaterCards = (int) getPageBuilderFields($id, $k, 'cards');

	for ($i = 0; $i < $repeaterCards; $i++) {
		$iconId = (int) getPageBuilderFields($id, $k, 'cards_' . $i . '_icon');
		$card = [
			'image__icon' => $iconId ? getImgUrlFromImageID($iconId, 'w_400') : '',
			'image_icon_alt' => $iconId ? getImgAltFromImageID($iconId) : '',
			'mod_counter' => [
				'number__number' => getPageBuilderFields($id, $k, 'cards_' . $i . '_counter_number'),
				'text__label' => getPageBuilderFields($id, $k, 'cards_' . $i . '_counter_label'),
			],
			'textarea__title' => nl2br((string) getPageBuilderFields($id, $k, 'cards_' . $i . '_title')),
		];
		$cardsArray[] = $card;
	}

	$extraTextsArray = [];
	$repeaterExtraTexts = (int) getPageBuilderFields($id, $k, 'extra_texts');
	for ($i = 0; $i < $repeaterExtraTexts; $i++) {
		$extraTextsArray[] = [
			'textarea__text' => nl2br((string) getPageBuilderFields($id, $k, 'extra_texts_' . $i . '_text')),
		];
	}
	$primaryButton = getPageBuilderFields($id, $k, 'button');
	$secondaryButton = getPageBuilderFields($id, $k, 'secondary_button');

	Twig::renderWithAttrs(
		'/03-modules/case-study-video/case-study-video.twig',
		[
			'case_study_video' => [
				'section_header' => [
					'text__super_title' => getPageBuilderFields($id, $k, 'super_title'),
					'textarea__title' => nl2br((string) getPageBuilderFields($id, $k, 'title')),
					'link__button' => $primaryButton['url'] ?? '',
					'button_target' => $primaryButton['target'] ?? '',
					'button_text' => $primaryButton['title'] ?? '',

					'link__secondary_button' => $secondaryButton['url'] ?? '',
					'secondary_button_text' => $secondaryButton['title'] ?? '',
				],
				'image__video_poster' => $videoPosterId ? getImgUrlFromImageID($videoPosterId, 'w_2560') : '',
				'file__video_mp4' => $videoMp4Id ? getVideoUrlFromVideoID($videoMp4Id) : '',
				'repeater__cards' => $cardsArray,
				'textarea__bottom_title' => nl2br((string) getPageBuilderFields($id, $k, 'bottom_title')),
				'repeater__extra_texts' => $extraTextsArray,
			],
		],
		$id,
		$k
	);
}
