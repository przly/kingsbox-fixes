<?php

function getLogoSliderFields(int $id, int $k): void
{
	$button = getPageBuilderFields($id, $k, 'button');
	$button = is_array($button) ? $button : [];
	$logoArray = [];
	$repeaterLogo = (int) getPageBuilderFields($id, $k, 'logo');

	for ($i = 0; $i < $repeaterLogo; $i++) {
		$link = getPageBuilderFields($id, $k, 'logo_' . $i . '_link');
		$link = is_array($link) ? $link : [];
		$imageId = (int) getPageBuilderFields($id, $k, 'logo_' . $i . '_image');

		$logoArray[] = [
			'link__link' => $link['url'] ?? '',
			'target' => $link['target'] ?? '',
			'rel' => $link['rel'] ?? '',
			'image__image' => $imageId ? getImgUrlFromImageID($imageId) : '',
			'image_alt' => $imageId ? getImgAltFromImageID($imageId) : '',
		];
	}

	Twig::renderWithAttrs(
		'/03-modules/logo-slider/logo-slider.twig',
		[
			'logo_slider' => [
				'text__super_title' => getPageBuilderFields($id, $k, 'super_title'),
				'select__section_title_tag' => getPageBuilderFields($id, $k, 'section_title_tag'),
				'textarea__section_title' => nl2br((string) getPageBuilderFields($id, $k, 'section_title')),
				'link__button' => $button['url'] ?? '',
				'button_text' => $button['title'] ?? '',
				'button_target' => $button['target'] ?? '',
				'button_rel' => $button['rel'] ?? '',
				'text__title' => getPageBuilderFields($id, $k, 'title'),
				'repeater__logo' => $logoArray,
			],
		],
		$id,
		$k
	);
}
