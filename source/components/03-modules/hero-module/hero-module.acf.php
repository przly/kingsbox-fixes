<?php

function getHeroModuleFields(int $id, int $k): void
{
	$primaryButton = getLinkArray(getPageBuilderFields($id, $k, 'primary_button') ?: '', '', 'primary_button');
	$secondaryButton = getLinkArray(getPageBuilderFields($id, $k, 'secondary_button') ?: '', '', 'secondary_button');
	$videoPosterId = (int) getPageBuilderFields($id, $k, 'video_poster');
	$videoMp4Id = (int) getPageBuilderFields($id, $k, 'video_mp4');
	$imageId = (int) getPageBuilderFields($id, $k, 'image');
	$image = $imageId
		? getImageArray($imageId, 'w_2560')
		: [
			'image__image' => '',
			'image_alt' => '',
		];

	Twig::renderWithAttrs(
		'/03-modules/hero-module/hero-module.twig',
		[
			'hero_module' => [
				'text__super_title' => getPageBuilderFields($id, $k, 'super_title'),
				'textarea__title' => nl2br((string) getPageBuilderFields($id, $k, 'title')),
				'image__video_poster' => $videoPosterId ? getImgUrlFromImageID($videoPosterId, 'w_2560') : '',
				'file__video_mp4' => $videoMp4Id ? getVideoUrlFromVideoID($videoMp4Id) : '',
				...$image,
				...$primaryButton,
				...$secondaryButton,
			],
		],
		$id,
		$k
	);
}
