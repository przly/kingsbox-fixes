<?php

function getAboutModuleFields(int $id, int $k): void
{
	$variation = getPageBuilderFields($id, $k, 'variation') ?: 'default';
	$twigVariation = in_array($variation, ['right-title', 'last-card-list'], true) ? $variation : 'default';
	$showCards = in_array($variation, ['default', 'last-card-list'], true);
	$showSteps = $variation === 'secondary';
	$showSectionHeading = $variation === 'secondary';

	$cardsArray = [];
	if ($showCards) {
		$repeaterCards = (int) getPageBuilderFields($id, $k, 'cards');
		for ($i = 0; $i < $repeaterCards; $i++) {
			$imageId = (int) getPageBuilderFields($id, $k, 'cards_' . $i . '_icon');
			$card = [
				'text__index' => getPageBuilderFields($id, $k, 'cards_' . $i . '_index'),
				'textarea__title' => nl2br((string) getPageBuilderFields($id, $k, 'cards_' . $i . '_title')),
			];
			if ($imageId) {
				$cardImage = getImageArray($imageId, 'w_400', 'icon');
				$cardImage['image_icon_alt'] = $cardImage['icon_alt'] ?? '';
				unset($cardImage['icon_alt'], $cardImage['icon_aria_label']);
				$card = [...$cardImage, ...$card];
			}

			$counter = [
				'number__number' => getPageBuilderFields($id, $k, 'cards_' . $i . '_counter_number'),
				'text__label' => getPageBuilderFields($id, $k, 'cards_' . $i . '_counter_label'),
			];
			if ($counter['number__number'] || $counter['text__label']) {
				$card['mod_counter'] = $counter;
			}
			$cardsArray[] = $card;
		}
	}

	$stepsArray = [];
	if ($showSteps) {
		$repeaterSteps = (int) getPageBuilderFields($id, $k, 'steps');
		for ($i = 0; $i < $repeaterSteps; $i++) {
			$imageId = (int) getPageBuilderFields($id, $k, 'steps_' . $i . '_image');
			$step = [
				'text__step_label' => getPageBuilderFields($id, $k, 'steps_' . $i . '_step_label'),
				'text__step' => getPageBuilderFields($id, $k, 'steps_' . $i . '_step'),
			];
			if ($imageId) {
				$stepImage = getImageArray($imageId, 'w_1024');
				unset($stepImage['image_aria_label']);
				$step = [...$stepImage, ...$step];
			}
			$stepsArray[] = $step;
		}
	}

	Twig::renderWithAttrs(
		'/03-modules/about-module/about-module.twig',
		[
			'about_module' => [
				'textarea__title' => nl2br((string) getPageBuilderFields($id, $k, 'title')),
				'repeater__cards' => $cardsArray,
				'wysiwyg__left_col_text' => applyContentFilter((string) getPageBuilderFields($id, $k, 'left_col_text')),
				'wysiwyg__right_col_text' => applyContentFilter((string) getPageBuilderFields($id, $k, 'right_col_text')),
				'text__super_title' => getPageBuilderFields($id, $k, 'super_title'),
				'select__section_title_tag' => $showSectionHeading
					? getPageBuilderFields($id, $k, 'section_title_tag')
					: '',
				'textarea__section_title' => $showSectionHeading
					? nl2br((string) getPageBuilderFields($id, $k, 'section_title'))
					: '',
				'repeater__steps' => $stepsArray,
				'text__left_col_title' => getPageBuilderFields($id, $k, 'left_col_title'),
				'text__right_col_title' => getPageBuilderFields($id, $k, 'right_col_title'),
				'boolean__white_bg' => in_array($variation, ['white-bg', 'right-title'], true)
					? true
					: ($variation === 'default' && (bool) getPageBuilderFields($id, $k, 'white_bg')),
				'select__variation' => $twigVariation,
			],
		],
		$id,
		$k
	);
}
