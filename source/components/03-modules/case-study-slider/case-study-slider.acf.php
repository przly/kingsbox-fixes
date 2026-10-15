<?php

function getCaseStudySliderFields(int $id, int $k): void
{
	$relationshipIds = getPageBuilderFields($id, $k, 'case_study_relationship') ?: [];

	$categoryId = getPageBuilderFields($id, $k, 'case_study_category')
		? [getPageBuilderFields($id, $k, 'case_study_category')]
		: [];
	$postIds = [];

	if ($relationshipIds !== []) {
		$query = new WP_Query([
			'post_type' => 'case-study',
			'post_status' => 'publish',
			'post__in' => $relationshipIds,
			'orderby' => 'post__in',
			'posts_per_page' => -1,
			'fields' => 'ids',
			'no_found_rows' => true,
			'lang' => FRONT_LANGUAGE,
		]);
		$postIds = $query->posts;
	} elseif ($categoryId) {
		$query = new WP_Query([
			'post_type' => 'case-study',
			'post_status' => 'publish',
			'tax_query' => [
				[
					'taxonomy' => 'case-study-category',
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
		$postIds = $query->posts;
	}

	$formatTextarea = static fn($value): string => nl2br((string) $value);
	$slidesArray = [];

	foreach ($postIds as $post) {
		$postId = $post instanceof WP_Post ? (int) $post->ID : (int) $post;
		if (!$postId) {
			continue;
		}

		$postTitle = (string) get_the_title($postId);
		$imageId = (int) get_post_thumbnail_id($postId);
		$imageAlt = $imageId ? getImgAltFromImageID($imageId) : '';
		$terms = get_the_terms($postId, 'case-study-category');
		$infoArray = [];

		if (is_array($terms)) {
			foreach ($terms as $term) {
				$infoArray[] = [
					'text__text' => $term->name ?? '',
				];
			}
		}

		$slidesArray[] = [
			'image__image' => $imageId ? getImgUrlFromImageID($imageId, 'w_1920') : '',
			'image_alt' => $imageAlt ?: $postTitle,
			'textarea__title' => $formatTextarea($postTitle),
			'repeater__info' => $infoArray,
			'link__link' => get_permalink($postId),
			'link_text' => $postTitle,
		];
	}

	$button = getPageBuilderFields($id, $k, 'button');
	$button = is_array($button) || is_string($button) ? $button : '';
	$buttonArray = getLinkArray($button, '', 'button');
	unset($buttonArray['button_aria_label']);
	$buttonArray = [
		'link__button' => '',
		'button_target' => '',
		'button_rel' => '',
		'button_text' => '',
		...$buttonArray,
	];

	Twig::renderWithAttrs(
		'/03-modules/case-study-slider/case-study-slider.twig',
		[
			'case_study_slider' => [
				'repeater__breadcrumbs' => $k === 0 ? getBreadcrumbs() : '',
				...$buttonArray,
				'boolean__small_cards' => (bool) getPageBuilderFields($id, $k, 'small_cards'),
				'textarea__title' => $formatTextarea(getPageBuilderFields($id, $k, 'title')),
				'select__title_tag' => getPageBuilderFields($id, $k, 'title_tag'),
				'select__title_modifier' => getPageBuilderFields($id, $k, 'title_tag'),
				'repeater__slides' => $slidesArray,
			],
		],
		$id,
		$k
	);
}
