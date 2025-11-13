import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Building2, Award, Package, TrendingUp } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { teamService } from '@/services/api/team.service';
import { useAuthStore } from '@/stores/authStore';
import type { Team, UpdateTeamRequest, PartnerTier, DeliveryModel } from '@/types/team';
import {
  AI_SPECIALIZATIONS,
  TECH_STACK,
  INDUSTRIES,
  DELIVERY_MODELS,
  PARTNER_TIERS,
  MIN_PROJECT_BUDGETS,
} from '@/constants/consultingFirm';

export default function TeamSettingsPage() {
  const { identifier } = useParams<{ identifier: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();

  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<UpdateTeamRequest>({
    name: '',
    description: '',
    website: '',
    city: '',
    isConsultingFirm: false,
    partnerTier: undefined,
    aiSpecializations: [],
    techStack: [],
    industries: [],
    deliveryModels: [],
    teamSize: undefined,
    foundedYear: undefined,
    minProjectBudget: undefined,
  });

  useEffect(() => {
    if (identifier) {
      loadTeam();
    }
  }, [identifier]);

  const loadTeam = async () => {
    if (!identifier) return;

    try {
      setIsLoading(true);
      setError(null);
      const result = await teamService.getTeam(identifier);
      setTeam(result);

      // Populate form data
      setFormData({
        name: result.name,
        description: result.description || '',
        website: result.website || '',
        city: result.city || '',
        isConsultingFirm: result.isConsultingFirm ?? false,
        partnerTier: result.partnerTier,
        aiSpecializations: result.aiSpecializations || [],
        techStack: result.techStack || [],
        industries: result.industries || [],
        deliveryModels: result.deliveryModels || [],
        teamSize: result.teamSize,
        foundedYear: result.foundedYear,
        minProjectBudget: result.minProjectBudget,
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load team');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!team) return;

    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      await teamService.updateTeam(team.id, formData);
      setSuccess('Team settings saved successfully!');

      // Reload team data
      await loadTeam();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof UpdateTeamRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: 'aiSpecializations' | 'techStack' | 'industries' | 'deliveryModels', item: string) => {
    const currentArray = (formData[field] as string[]) || [];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    handleChange(field, newArray);
  };

  // Check if user has permission
  const canEdit = team && (team.ownerId === currentUser?.id ||
    team.members?.some(m => m.userId === currentUser?.id && (m.role === 'ADMIN' || m.role === 'OWNER')));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 pb-16 px-4">
          <div className="max-w-7xl mx-auto text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <div className="text-lg">Loading team settings...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !team) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 pb-16 px-4">
          <div className="max-w-7xl mx-auto text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {error || 'Team not found'}
            </h3>
            <Button onClick={() => navigate('/teams')} className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Teams
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 pb-16 px-4">
          <div className="max-w-7xl mx-auto text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              You don't have permission to edit this team
            </h3>
            <Button onClick={() => navigate(`/teams/${team?.slug}`)} className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Team
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Link to={`/teams/${team?.slug}`}>
              <Button variant="ghost" className="gap-2 mb-4">
                <ArrowLeft className="w-4 h-4" />
                Back to Team
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Team Settings</h1>
            <p className="text-muted-foreground mt-2">
              Manage your team profile and consulting firm information
            </p>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="basic" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="consulting">
                  Consulting Firm Profile
                </TabsTrigger>
              </TabsList>

              {/* Basic Info Tab */}
              <TabsContent value="basic" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                      Update your team's basic details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Team Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        rows={4}
                        placeholder="Tell us about your team..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        value={formData.website}
                        onChange={(e) => handleChange('website', e.target.value)}
                        placeholder="https://example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">Location</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        placeholder="San Francisco, CA"
                      />
                    </div>

                    {/* Consulting Firm Toggle */}
                    <div className="flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <input
                        type="checkbox"
                        id="isConsultingFirm"
                        checked={formData.isConsultingFirm}
                        onChange={(e) => handleChange('isConsultingFirm', e.target.checked)}
                        className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary border-gray-300 rounded"
                      />
                      <div className="flex-1">
                        <Label htmlFor="isConsultingFirm" className="font-medium cursor-pointer">
                          Register as AI Consulting Firm
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Join our marketplace to showcase your AI/ML consulting services
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Consulting Firm Profile Tab */}
              <TabsContent value="consulting" className="space-y-6">
                {!formData.isConsultingFirm ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Building2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">Not a Consulting Firm</h3>
                      <p className="text-muted-foreground mb-4">
                        Enable "Register as AI Consulting Firm" in Basic Info to access this section
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    {/* AI Specializations */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Award className="w-5 h-5" />
                          AI Specializations
                        </CardTitle>
                        <CardDescription>
                          Select the AI/ML areas your firm specializes in
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {AI_SPECIALIZATIONS.map((spec) => (
                            <button
                              key={spec}
                              type="button"
                              onClick={() => toggleArrayItem('aiSpecializations', spec)}
                              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                formData.aiSpecializations?.includes(spec)
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {spec}
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Tech Stack */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Package className="w-5 h-5" />
                          Tech Stack
                        </CardTitle>
                        <CardDescription>
                          Technologies and frameworks your team uses
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {TECH_STACK.map((tech) => (
                            <button
                              key={tech}
                              type="button"
                              onClick={() => toggleArrayItem('techStack', tech)}
                              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                formData.techStack?.includes(tech)
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {tech}
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Industries */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="w-5 h-5" />
                          Industries Served
                        </CardTitle>
                        <CardDescription>
                          Industries you have experience working with
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {INDUSTRIES.map((industry) => (
                            <button
                              key={industry}
                              type="button"
                              onClick={() => toggleArrayItem('industries', industry)}
                              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                formData.industries?.includes(industry)
                                  ? 'bg-green-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {industry}
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Delivery Models & Company Info */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" />
                          Delivery Models & Company Info
                        </CardTitle>
                        <CardDescription>
                          How you work with clients and company details
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Delivery Models */}
                        <div className="space-y-2">
                          <Label>Delivery Models</Label>
                          <div className="flex flex-wrap gap-2">
                            {DELIVERY_MODELS.map((model) => (
                              <button
                                key={model.value}
                                type="button"
                                onClick={() => toggleArrayItem('deliveryModels', model.value)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                  formData.deliveryModels?.includes(model.value)
                                    ? 'bg-orange-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {model.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="teamSize">Team Size</Label>
                            <Input
                              id="teamSize"
                              type="number"
                              value={formData.teamSize || ''}
                              onChange={(e) => handleChange('teamSize', parseInt(e.target.value) || undefined)}
                              placeholder="Number of consultants"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="foundedYear">Founded Year</Label>
                            <Input
                              id="foundedYear"
                              type="number"
                              value={formData.foundedYear || ''}
                              onChange={(e) => handleChange('foundedYear', parseInt(e.target.value) || undefined)}
                              placeholder="e.g., 2020"
                              min="1900"
                              max={new Date().getFullYear()}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="minProjectBudget">Minimum Project Budget</Label>
                            <select
                              id="minProjectBudget"
                              value={formData.minProjectBudget || ''}
                              onChange={(e) => handleChange('minProjectBudget', parseInt(e.target.value) || undefined)}
                              className="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                              <option value="">Select minimum</option>
                              {MIN_PROJECT_BUDGETS.map((budget) => (
                                <option key={budget.value} value={budget.value}>
                                  {budget.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </TabsContent>
            </Tabs>

            {/* Save Button */}
            <div className="flex justify-end gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/teams/${team?.slug}`)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
