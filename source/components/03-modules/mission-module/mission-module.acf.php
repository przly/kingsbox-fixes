<?php

function getMissionModuleFields(int $id, int $k): void
{
	$primaryButton = getLinkArray(getPageBuilderFields($id, $k, 'button') ?: '', '', 'button');
	unset($primaryButton['button_aria_label']);

	$title = (string) getPageBuilderFields($id, $k, 'title');
	$textarea__title = preg_match('/<br\s*\/?\s*>/i', $title) ? $title : nl2br($title);

	$stepsArray = [];
	$repeaterSteps = (int) getPageBuilderFields($id, $k, 'steps');
	for ($i = 0; $i < $repeaterSteps; $i++) {
		$imageId = (int) getPageBuilderFields($id, $k, 'steps_' . $i . '_image');
		$step = [
			'text__step_label' => getPageBuilderFields($id, $k, 'steps_' . $i . '_step_label'),
			'text__step' => getPageBuilderFields($id, $k, 'steps_' . $i . '_step'),
			'image__image' => '',
			'image_alt' => '',
			'text__title' => getPageBuilderFields($id, $k, 'steps_' . $i . '_title'),
		];

		if ($imageId) {
			$stepImage = getImageArray($imageId, 'w_1024');
			unset($stepImage['image_aria_label']);
			$step = [...$step, ...$stepImage];
		}

		$stepsArray[] = $step;
	}

	Twig::renderWithAttrs(
		'/03-modules/mission-module/mission-module.twig',
		[
			'mission_module' => [
				'text__super_title' => getPageBuilderFields($id, $k, 'super_title'),
				'textarea__title' => $textarea__title,
				...$primaryButton,
				'repeater__steps' => $stepsArray,
			],
		],
		$id,
		$k
	);
}
