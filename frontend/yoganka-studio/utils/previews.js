export const defaultIntroPreview = {
  select: {
    title: `sectionTitle`,
    media: 'backgroundImage',
  },
};
export const defaultModalSummaryPreview = type => {
  const icons = {
    included: '✔️',
    excluded: '👉🏻',
    optional: '➕',
    freeTime: '🌿',
  };

  return {
    select: {
      title: 'title',
      list: 'list',
    },
    prepare({ title, list }) {
      return {
        title: `${icons[type]} ${title}`,
        subtitle: list?.length
          ? `Aktywności: ${list.length}`
          : 'Brak aktywności',
      };
    },
  };
};
