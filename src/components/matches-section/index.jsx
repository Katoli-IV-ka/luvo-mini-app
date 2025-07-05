import { EmptyState } from "../empty-state";
import { MetchesList } from "../metches-list";

export const MatchesSection = ({ metchesData, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-red"></div>
      </div>
    );
  }

  if (!metchesData || metchesData.length === 0) {
    return <EmptyState type="matches" />;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Взаимные симпатии ({metchesData.length})
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Люди, с которыми у вас взаимная симпатия
        </p>
      </div>

      <MetchesList metches={metchesData} />
    </div>
  );
};
