import type { FieldDef } from './form/types'

const cta = (name = 'cta', label = 'Button'): FieldDef => ({
  type: 'group',
  name,
  label,
  fields: [
    { type: 'text', name: 'label', label: 'Label' },
    { type: 'text', name: 'href', label: 'Link', hint: 'e.g. /about, /platform/powerx, #contact' },
  ],
})
const imageObj = (name: string, label: string): FieldDef => ({
  type: 'group',
  name,
  label,
  fields: [
    { type: 'image', name: 'src', label: 'Image' },
    { type: 'text', name: 'alt', label: 'Alt text' },
  ],
})

/* ---------------- Site Settings ---------------- */
export const siteSettingsSchema: FieldDef[] = [
  imageObj('logo', 'Logo'),
  {
    type: 'array',
    name: 'nav',
    label: 'Navigation',
    itemTitleKey: 'label',
    newItem: () => ({ label: '', href: '', cta: false, dropdown: [] }),
    fields: [
      { type: 'text', name: 'label', label: 'Label' },
      { type: 'text', name: 'href', label: 'Link' },
      { type: 'checkbox', name: 'cta', label: 'Show as outlined button' },
      {
        type: 'array',
        name: 'dropdown',
        label: 'Dropdown items',
        itemTitleKey: 'name',
        newItem: () => ({ name: '', sector: '', href: '' }),
        fields: [
          { type: 'text', name: 'name', label: 'Name' },
          { type: 'text', name: 'sector', label: 'Sector' },
          { type: 'text', name: 'href', label: 'Link' },
        ],
      },
    ],
  },
  { type: 'stringList', name: 'closingQuote.lines', label: 'Closing quote', hint: 'One line per row. May include <em> for emphasis.' },
  imageObj('bridgeImage', 'Bridge image'),
  {
    type: 'group',
    name: 'footer',
    label: 'Footer',
    fields: [
      { type: 'text', name: 'locations', label: 'Locations line' },
      {
        type: 'array',
        name: 'links',
        label: 'Footer links',
        itemTitleKey: 'label',
        newItem: () => ({ label: '', href: '', external: false }),
        fields: [
          { type: 'text', name: 'label', label: 'Label' },
          { type: 'text', name: 'href', label: 'Link' },
          { type: 'checkbox', name: 'external', label: 'Open in new tab' },
        ],
      },
    ],
  },
]

/* ---------------- Home Page (4 fixed slides) ---------------- */
const titleField: FieldDef = { type: 'lines', name: 'title', label: 'Title' }
export const homeSchema: FieldDef[] = [
  {
    type: 'group',
    name: 'deck',
    label: 'Deck settings',
    fields: [
      { type: 'text', name: 'deckActName', label: 'Deck label' },
      { type: 'stringList', name: 'railChapters', label: 'Rail chapter labels', hint: 'One per slide, in order.' },
    ],
  },
  {
    type: 'group',
    name: 'deck.slides.0',
    label: 'Slide 1 — Investing',
    fields: [
      { type: 'text', name: 'kicker', label: 'Kicker' },
      titleField,
      { type: 'textarea', name: 'copy', label: 'Body copy', hint: 'May use <em>/<strong>.' },
      cta(),
      { type: 'image', name: 'coreMark', label: 'Sphere core mark' },
      {
        type: 'array', name: 'soiTiles', label: 'Sphere tiles', itemTitleKey: 'label',
        newItem: () => ({ label: '', image: '' }),
        fields: [{ type: 'text', name: 'label', label: 'Label' }, { type: 'image', name: 'image', label: 'Image' }],
      },
    ],
  },
  {
    type: 'group',
    name: 'deck.slides.1',
    label: 'Slide 2 — Impact',
    fields: [
      { type: 'text', name: 'kicker', label: 'Kicker' },
      titleField,
      {
        type: 'array', name: 'backgroundSlices', label: 'Background images',
        newItem: () => ({ image: '', position: '' }),
        fields: [{ type: 'image', name: 'image', label: 'Image' }, { type: 'text', name: 'position', label: 'Position', hint: 'e.g. center 20%' }],
      },
      {
        type: 'array', name: 'stats', label: 'Stats', itemTitleKey: 'label',
        newItem: () => ({ value: 0, suffix: '', label: '' }),
        fields: [
          { type: 'number', name: 'value', label: 'Number' },
          { type: 'text', name: 'suffix', label: 'Suffix', hint: 'e.g. +' },
          { type: 'text', name: 'label', label: 'Label' },
        ],
      },
    ],
  },
  {
    type: 'group',
    name: 'deck.slides.2',
    label: 'Slide 3 — Ecosystems',
    fields: [
      { type: 'text', name: 'kicker', label: 'Kicker' },
      titleField,
      { type: 'textarea', name: 'copy', label: 'Body copy' },
      cta(),
      { type: 'image', name: 'backgroundImage', label: 'Background image' },
    ],
  },
  {
    type: 'group',
    name: 'deck.slides.3',
    label: 'Slide 4 — Platforms',
    fields: [
      { type: 'text', name: 'kicker', label: 'Kicker' },
      titleField,
      { type: 'textarea', name: 'copy', label: 'Body copy' },
      cta(),
      {
        type: 'array', name: 'strips', label: 'Platform strips', itemTitleKey: 'tab',
        newItem: () => ({ tab: '', logo: '', image: '', statStrong: '', statSpan: '', desc: '', href: '' }),
        fields: [
          { type: 'text', name: 'tab', label: 'Sector tab' },
          { type: 'image', name: 'logo', label: 'Logo' },
          { type: 'image', name: 'image', label: 'Background image' },
          { type: 'text', name: 'statStrong', label: 'Stat (bold)' },
          { type: 'text', name: 'statSpan', label: 'Stat (caption)' },
          { type: 'textarea', name: 'desc', label: 'Description' },
          { type: 'text', name: 'href', label: 'Link' },
        ],
      },
    ],
  },
]

/* ---------------- About Page ---------------- */
export const aboutSchema: FieldDef[] = [
  {
    type: 'group', name: 'hero', label: 'Hero',
    fields: [
      { type: 'text', name: 'actName', label: 'Act label' },
      { type: 'lines', name: 'title', label: 'Title' },
      { type: 'textarea', name: 'subtitle', label: 'Subtitle', hint: 'May use <em>.' },
      { type: 'textarea', name: 'intro', label: 'Intro paragraph' },
      { type: 'stringList', name: 'sectorChips', label: 'Sector chips' },
      { type: 'image', name: 'heroImage', label: 'Hero band image' },
      {
        type: 'array', name: 'ledger', label: 'Ledger stats', itemTitleKey: 'label',
        newItem: () => ({ value: 0, prefix: '', suffix: '', plain: false, label: '' }),
        fields: [
          { type: 'number', name: 'value', label: 'Number' },
          { type: 'text', name: 'prefix', label: 'Prefix', hint: 'e.g. $' },
          { type: 'text', name: 'suffix', label: 'Suffix', hint: 'e.g. + Yrs' },
          { type: 'checkbox', name: 'plain', label: 'No thousands separator (years)' },
          { type: 'text', name: 'label', label: 'Label' },
        ],
      },
    ],
  },
  {
    type: 'group', name: 'belief', label: 'Belief',
    fields: [
      { type: 'text', name: 'actName', label: 'Act label' },
      { type: 'textarea', name: 'kicker', label: 'Kicker' },
      {
        type: 'array', name: 'rows', label: 'Belief rows', itemTitleKey: 'num',
        newItem: () => ({ num: '', line: '', note: '' }),
        fields: [
          { type: 'text', name: 'num', label: 'Number' },
          { type: 'textarea', name: 'line', label: 'Headline', hint: 'Use <strong> + <em>.' },
          { type: 'textarea', name: 'note', label: 'Note' },
        ],
      },
    ],
  },
  {
    type: 'group', name: 'method', label: 'Method',
    fields: [
      { type: 'text', name: 'actName', label: 'Act label' },
      { type: 'lines', name: 'title', label: 'Title' },
      { type: 'textarea', name: 'copy', label: 'Copy' },
      {
        type: 'array', name: 'cards', label: 'Method cards', itemTitleKey: 'stage',
        newItem: () => ({ stage: '', icon: '', title: '', desc: '' }),
        fields: [
          { type: 'text', name: 'stage', label: 'Stage label' },
          { type: 'image', name: 'icon', label: 'Icon' },
          { type: 'textarea', name: 'title', label: 'Title', hint: 'Use <br> for the line break.' },
          { type: 'textarea', name: 'desc', label: 'Description' },
        ],
      },
    ],
  },
  {
    type: 'group', name: 'models', label: 'Models',
    fields: [
      { type: 'text', name: 'actName', label: 'Act label' },
      { type: 'lines', name: 'title', label: 'Title' },
      { type: 'textarea', name: 'copy', label: 'Copy' },
      {
        type: 'array', name: 'rows', label: 'Model rows', itemTitleKey: 'title',
        newItem: () => ({ num: '', icon: '', image: '', title: '', desc: '' }),
        fields: [
          { type: 'text', name: 'num', label: 'Number' },
          { type: 'image', name: 'icon', label: 'Icon' },
          { type: 'image', name: 'image', label: 'Stage image' },
          { type: 'text', name: 'title', label: 'Title' },
          { type: 'textarea', name: 'desc', label: 'Description' },
        ],
      },
    ],
  },
  {
    type: 'group', name: 'ecosystem', label: 'Ecosystem',
    fields: [
      { type: 'text', name: 'actName', label: 'Act label' },
      { type: 'lines', name: 'title', label: 'Title' },
      { type: 'textarea', name: 'copy', label: 'Copy' },
      {
        type: 'array', name: 'tiles', label: 'Ecosystem tiles', itemTitleKey: 'logoAlt',
        newItem: () => ({ image: '', logo: '', logoAlt: '', text: '', moreLabel: 'Learn More', href: '' }),
        fields: [
          { type: 'image', name: 'image', label: 'Image' },
          { type: 'image', name: 'logo', label: 'Logo' },
          { type: 'text', name: 'logoAlt', label: 'Logo alt / name' },
          { type: 'textarea', name: 'text', label: 'Text' },
          { type: 'text', name: 'moreLabel', label: 'Link label' },
          { type: 'text', name: 'href', label: 'Link' },
        ],
      },
    ],
  },
  {
    type: 'group', name: 'grids', label: 'GRIDS',
    fields: [
      { type: 'text', name: 'actName', label: 'Act label' },
      { type: 'lines', name: 'title', label: 'Title' },
      { type: 'textarea', name: 'copy', label: 'Copy' },
      { type: 'image', name: 'morphImage', label: 'Morph image' },
      { type: 'group', name: 'labelA', label: 'Label A (fragmented)', fields: [{ type: 'text', name: 'title', label: 'Title' }, { type: 'text', name: 'text', label: 'Text' }] },
      { type: 'group', name: 'labelB', label: 'Label B (integrated)', fields: [{ type: 'text', name: 'title', label: 'Title' }, { type: 'text', name: 'text', label: 'Text' }] },
      {
        type: 'array', name: 'layers', label: 'GRIDS layers', itemTitleKey: 'title',
        newItem: () => ({ num: '', icon: '', title: '', subtitle: '' }),
        fields: [
          { type: 'text', name: 'num', label: 'Number' },
          { type: 'image', name: 'icon', label: 'Icon' },
          { type: 'text', name: 'title', label: 'Title' },
          { type: 'text', name: 'subtitle', label: 'Subtitle' },
        ],
      },
    ],
  },
]

/* ---------------- Platform ---------------- */
export const platformSchema: FieldDef[] = [
  { type: 'number', name: 'order', label: 'Display order' },
  { type: 'text', name: 'name', label: 'Platform name' },
  { type: 'text', name: 'sector', label: 'Sector' },
  { type: 'image', name: 'wordmark', label: 'Wordmark' },
  { type: 'image', name: 'hero', label: 'Hero / poster image' },
  { type: 'image', name: 'video', label: 'Hero video (mp4)' },
  { type: 'textarea', name: 'tagline', label: 'Tagline' },
  { type: 'textarea', name: 'intro', label: 'Intro' },
  {
    type: 'array', name: 'totals', label: 'Totals band', itemTitleKey: 'label',
    newItem: () => ({ value: '', label: '' }),
    fields: [{ type: 'text', name: 'value', label: 'Value' }, { type: 'text', name: 'label', label: 'Label' }],
  },
  {
    type: 'array', name: 'categories', label: 'Categories', itemTitleKey: 'label',
    newItem: () => ({ label: '', ventures: [] }),
    fields: [
      { type: 'text', name: 'label', label: 'Category label' },
      {
        type: 'array', name: 'ventures', label: 'Ventures', itemTitleKey: 'name',
        newItem: () => ({ name: '', logo: '', photo: '', desc: '', metrics: [] }),
        fields: [
          { type: 'text', name: 'name', label: 'Name' },
          { type: 'image', name: 'logo', label: 'Logo (optional)' },
          { type: 'image', name: 'photo', label: 'Photo' },
          { type: 'textarea', name: 'desc', label: 'Description' },
          {
            type: 'array', name: 'metrics', label: 'Metrics', itemTitleKey: 'label',
            newItem: () => ({ value: '', label: '' }),
            fields: [{ type: 'text', name: 'value', label: 'Value' }, { type: 'text', name: 'label', label: 'Label' }],
          },
        ],
      },
    ],
  },
]
