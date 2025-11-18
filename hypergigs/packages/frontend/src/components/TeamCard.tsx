import { Link } from 'react-router-dom';
import { MapPin, Users, MoveRight, CheckCircle2, Building } from 'lucide-react';
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
    
      <Card className="group shadow-none transition-all duration-300 border-0 overflow-hidden h-full relative rounded-xl"
      >
        <CardContent className="p-0 relative">
          <div className="bg-slate-50/80 px-4 pt-8 pb-8 sm:px-6 lg:px-8 border-b border-slate-100">
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
              <h3 className="text-xl font-bold text-slate-950 mb-2 group-hover:text-primary transition-colors truncate">
                {team.name}
              </h3>
              {/* <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Users strokeWidth={1} className="w-4 h-4 text-black" />
                <span className="text-xs text-slate-500">{getTypeLabel(team.type)}</span>
              </div> */}


          {/* AI Consulting Firm Badge */}
          {team.isConsultingFirm && (
            <div className="mb-4">
              <Badge className="bg-blue-50 text-blue-800 shadow-none border border-blue-200 hover:bg-blue-100 rounded-xl px-3 py-1 text-xs font-normal">
                <Building strokeWidth={1} className="w-4 h-4 text-black mr-2" /> AI Consulting &amp; Agentic Dev
              </Badge>
            </div>
          )}
            </div>
          </div>

          {/* Description */}
          {team.description && (
            <p className="text-slate-800 text-sm mb-8 line-clamp-2 leading-6">
              {team.description}
            </p>
          )}

           {/* Stats Row */}
          <div className="flex gap-8 text-sm">
            
            {/* Talent Score - Placeholder */}
            <div className="flex items-center gap-2">
              <span className="text-slate-800 font-semibold">Score</span>
              <span className="font-normal text-slate-800">
                {talentScore}/{maxScore}
              </span>
            </div>

            {/* Hiring Status */}
            {team._count?.jobPostings !== undefined && team._count.jobPostings > 0 && (
              <>
                <div className="text-slate-300"> | </div>
                
                  <span className="text-slate-800 font-bold">Hiring</span>
                  <div className="text-slate-300"> | </div>
          
              </>
            )}

            {/* Job Count */}
            {team._count?.jobPostings !== undefined && team._count.jobPostings > 0 && (
              <>
                <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div> 
                <Link to={`/teams/${team.slug}/jobs`} className="text-blue-700 font-semibold hover:text-primary/80 transition-colors">
                  {team._count.jobPostings} {team._count.jobPostings === 1 ? 'job' : 'Jobs Live'}
                </Link>
                </div>
              </>
              
            )}
            
          </div>

          </div>
          
          <div className="px-4 sm:px-6 lg:px-8 py-8 relative min-h-[180px] bg-white">
          {/* AI Specializations Section */}
          {team.isConsultingFirm && team.aiSpecializations && team.aiSpecializations.length > 0 && (
            <div className="mb-4 pb-4">
              <h4 className="text-sm font-bold text-slate-800 mb-3">AI Specialisations</h4>
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
        </div>
        
          <div className="relative min-h-[90px] bg-white">

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
           <Link to={`/teams/${team.slug}`}>
          <div className="space-y-4 bg-white px-4 py-8 sm:px-6 lg:px-8 border-t border-slate-200 absolute bottom-0 left-0 w-full">
 
            {team.city && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4 text-slate-800" />
                <span className="text-sm text-slate-800">{team.city}</span>
              </div>
            )}
        
        {/* //team size removed */}

            {team._count && team._count.members > 0 && (
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4 text-slate-800" />
                <span className="text-sm text-slate-800">Team size: {team._count.members} specialists</span>
              </div>
            )}
          </div>

          {/* Arrow Indicator - Hidden by default, shown on hover */}
          <div className="absolute bottom-8 right-8 opacity-10 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 flex items-center justify-center">
              <MoveRight className="w-8 h-8 text-slate-950" strokeWidth={1.5} /> 
            </div>
          </div>
</Link>
          </div>
        </CardContent>
      </Card>
  );
}
