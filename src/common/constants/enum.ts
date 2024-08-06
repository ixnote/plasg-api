export enum NewsSectionTypes{
  HEADING = 'heading',
  HIGHLIGHT = 'highlight',
  TEXT = 'text',
  PARAGRAPH = 'paragraph',
  VIDEO = 'video',
  HYPERLINK = 'hyperlink',
  IMAGE = 'image',
  BULLET = 'bullet',
  SUB_HEADING = 'sub_heading',
  SECTION_TITLE = 'section_title'
}

export enum UserRoles {
  SUPER = 'super',
  MDA = 'mda-admin',
}

export enum ProjectStatus {
  COMPLETED = "completed",
  ONGOING = "ongoing",
  SUSPENDED = "suspended"
}

export enum DestinationTypes {
  LANDMARK = 'landmark',
  PARK = 'park',
  Gallery = 'gallery',
  STAY = "stay",
  EAT = "eat"
}

export enum LegislativeTypes{
  LEGISLATIVE = 'legislative',
  OFFICIAL = 'official',
  CABINET = 'cabinet',
}

export enum ComponentType {
  
}

export enum TagType {
  TOPIC = "topic",
  ITEM = "item",
  NEWS = "news"
}

export enum TokenTimeout {
  FIVE_MINS = 60 * 5,
  FIFTEEN_MINS = 60 * 15,
  THIRTY_MINS = 60 * 30,
  ONE_HOUR = 60 * 60,
  TWO_HOUR = 2 * 60 * 60,
  SIX_HOUR = 60 * 60 * 6,
  TWELVE_HOUR = 60 * 60 * 12,
  TWENTY_FOUR_HOUR = 60 * 60 * 24,
  TWO_WEEKS = 60 * 60 * 24 * 14,
}

export enum Environments {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

export enum Routes {
  HEALTH = 'health',
}

export enum HealthRoutes {
  IP_ADDR = 'ip-addr',
}
