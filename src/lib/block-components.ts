import type { FC } from 'react';
import type { Group } from '@/types/umi-data';
import ArticleContent from '@/components/blocks/article-content';
import ContactList from '@/components/blocks/contact-list';
import ContactMap from '@/components/blocks/contact-map';
import DocumentList from '@/components/blocks/document-list';
import FeatureList from '@/components/blocks/feature-list';
import Feedback from '@/components/blocks/feedback';
import FloorPlanList from '@/components/blocks/floor-plan-list';
import Hero from '@/components/blocks/hero';
import ImageGallery from '@/components/blocks/image-gallery';
import InfoContent from '@/components/blocks/info-content';
import IntroVideo from '@/components/blocks/intro-video';
import LoanCalculator from '@/components/blocks/loan-calculator';
import LoanList from '@/components/blocks/loan-list';
import Location from '@/components/blocks/location';
import MasterPlan from '@/components/blocks/master-plan';
import MediaGallery from '@/components/blocks/media-gallery';
import NewsList from '@/components/blocks/news-list';
import PartnerList from '@/components/blocks/partner-list';
import ProjectList from '@/components/blocks/project-list';
import QuoteList from '@/components/blocks/quote-list';
import SearchList from '@/components/blocks/search-list';
import StatList from '@/components/blocks/stat-list';
import TeamList from '@/components/blocks/team-list';
import TextContent from '@/components/blocks/text-content';

interface BlockComponentProps {
  data: Group;
}

type BlockComponent = FC<BlockComponentProps>;

const blockComponents: Record<string, BlockComponent> = {
  article_content_block: ArticleContent,
  contact_list_block: ContactList,
  contact_map_block: ContactMap,
  document_list_block: DocumentList,
  feature_list_block: FeatureList,
  feedback_block: Feedback,
  floor_plan_list_block: FloorPlanList,
  hero_block: Hero,
  image_gallery_block: ImageGallery,
  info_content_block: InfoContent,
  intro_video_block: IntroVideo,
  loan_calculator_block: LoanCalculator,
  loan_list_block: LoanList,
  location_block: Location,
  master_plan_block: MasterPlan,
  media_gallery_block: MediaGallery,
  news_list_block: NewsList,
  partner_list_block: PartnerList,
  project_list_block: ProjectList,
  quote_list_block: QuoteList,
  search_list_block: SearchList,
  stat_list_block: StatList,
  team_list_block: TeamList,
  text_content_block: TextContent,
};

export const getBlockComponent = (blockName: string): BlockComponent | undefined => {
  return blockComponents[blockName];
};
