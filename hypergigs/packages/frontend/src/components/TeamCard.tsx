import { Link } from 'react-router-dom';
import { MapPin, Users, MoveRight, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { TeamType } from '@/types/team';

interface TeamCardProps {
  team: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    type: TeamType;
    city?: string;
    avatar?: string;
    isConsultingFirm?: boolean;
    isVerified?: boolean;
    aiSpecializations?: string[];
    techStack?: string[];
    _count?: {
      members: number;
      projects?: number;
      jobPostings?: number;
    };
  };
}

export default function TeamCard({ team }: TeamCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getTypeLabel = (type: TeamType) => {
    if (type === 'COMPANY') return 'Independent Team';
    if (type === 'ORGANIZATION') return 'Organization';
    return 'Team';
  };

  // Placeholder talent score - will be calculated by AI later
  const talentScore = 4.6;
  const maxScore = 5;

  return (
    
      <Card className="group shadow-none transition-all duration-300 border overflow-hidden h-full relative"
      style={{ backgroundImage: "linear-gradient(20deg, #ebebeb1a 0%, #ffffffff 50%)" }}>
        <CardContent className="p-0 relative">
          <div className="bg-gray-200/20 px-4 pt-8 pb-4 sm:px-6 lg:px-4 border-b border-slate-200">
          {/* Header Section */}
          
          <div className="flex items-start gap-4 mb-4">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {team.avatar ? (
                <img
                  src={team.avatar}
                  alt={team.name}
                  className="w-16 h-16 rounded-full object-cover border border-border"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xl font-bold border border-border">
                  {getInitials(team.name)}
                </div>
              )}

              {/* Verified Badge - Top Right */}
              {team.isVerified && (
                <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* Title and Type */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors truncate">
                {team.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users className="w-4 h-4" />
                <span>{getTypeLabel(team.type)}</span>
              </div>
            </div>
          </div>

          {/* AI Consulting Firm Badge */}
          {team.isConsultingFirm && (
            <div className="mb-4">
              <Badge className="bg-blue-100 text-blue-900 shadow-none hover:bg-slate-200 rounded-xl px-4 py-1 text-xs font-normal">
                AI Consulting Firm
              </Badge>
            </div>
          )}

          {/* Description */}
          {team.description && (
            <p className="text-gray-900 text-sm mb-4 line-clamp-2 leading-tight">
              {team.description}
            </p>
          )}

  </div>
  <div className="px-4 sm:px-6 lg:px-4 pt-4 pb-4 relative">
          {/* AI Specializations Section */}
          {team.isConsultingFirm && team.aiSpecializations && team.aiSpecializations.length > 0 && (
            <div className="mb-4 pb-4 border-b border-slate-200">
              <h4 className="text-xs font-medium text-gray-900 mb-3">AI Specialisations</h4>
              <div className="flex flex-wrap gap-2">
                {team.aiSpecializations.slice(0, 3).map((spec, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-0 px-3 py-1 text-xs font-normal rounded-sm"
                  >
                    {spec}
                  </Badge>
                ))}
                {team.aiSpecializations.length > 3 && (
                  <Badge
                    variant="secondary"
                    className="bg-gray-50 text-gray-500 hover:bg-gray-100 border-0 px-2 py-1 text-xs font-medium rounded-lg"
                  >
                    +{team.aiSpecializations.length - 3} more
                  </Badge>
                )}
              </div>
            
            </div>
            
          )}
        

          {/* Tech Stack Section */}
          {/* {team.isConsultingFirm && team.techStack && team.techStack.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Tech stack</h4>
              <div className="flex flex-wrap gap-2">
                {team.techStack.slice(0, 3).map((tech, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-0 px-3 py-1.5 text-sm font-medium rounded-lg"
                  >
                    {tech}
                  </Badge>
                ))}
                {team.techStack.length > 3 && (
                  <Badge
                    variant="secondary"
                    className="bg-gray-50 text-gray-600 hover:bg-gray-100 border-0 px-3 py-1.5 text-sm font-medium rounded-lg"
                  >
                    +{team.techStack.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )} */}




          {/* Footer - Location & Team Size */}
          
          <div className="space-y-2">
 
          {/* Stats Row */}
          <div className="flex items-center gap-4 mb-6 border-b border-slate-200 text-xs pb-4">
            
            {/* Talent Score - Placeholder */}
            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-medium">Score</span>
              <span className="font-bold text-gray-900">
                {talentScore}/{maxScore}
              </span>
            </div>

            {/* Hiring Status */}
            {team._count?.jobPostings !== undefined && team._count.jobPostings > 0 && (
              <>
                <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-gray-700 font-medium">Hiring</span>
                </div>
              </>
            )}

            {/* Job Count */}
            {team._count?.jobPostings !== undefined && team._count.jobPostings > 0 && (
              <>
                <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                <Link to={`/teams/${team.slug}/jobs`} className="text-primary font-semibold underline hover:text-primary/80 transition-colors">
                  {team._count.jobPostings} {team._count.jobPostings === 1 ? 'job' : 'jobs'}
                </Link>
              </>
            )}
          </div>

            {team.city && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{team.city}</span>
              </div>
            )}
        
        {/* //team size removed */}

            {/* {team._count && team._count.members > 0 && (
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4" />
                <span className="text-sm">Team size {team._count.members} specialists</span>
              </div>
            )} */}
          </div>

          {/* Arrow Indicator - Hidden by default, shown on hover */}
          <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
              <Link to={`/teams/${team.slug}`}><MoveRight className="w-6 h-6 text-white" strokeWidth={1} /> </Link>
            </div>
          </div>

          </div>
        </CardContent>
      </Card>
  );
}
