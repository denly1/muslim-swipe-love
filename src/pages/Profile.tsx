
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Camera, User, MapPin } from 'lucide-react';
import Layout from '@/components/Layout';
import { useProfiles, UserProfile } from '@/hooks/useProfiles';
import { useAuth } from '@/hooks/useAuth';

const profileSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  age: z.coerce.number().min(18, 'Возраст должен быть от 18 лет'),
  bio: z.string().min(20, 'Опишите себя минимум 20 символами'),
  religiousLevel: z.enum(['practicing', 'moderate', 'cultural']),
  maritalStatus: z.enum(['single', 'divorced', 'widowed']),
  lookingFor: z.enum(['marriage', 'friendship', 'both']),
  city: z.string().min(2, 'Укажите город'),
  country: z.string().min(2, 'Укажите страну'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const { userProfile, updateUserProfile } = useProfiles();
  const { user, isPremium } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Set up form with default values from user profile
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: userProfile?.name || '',
      age: userProfile?.age || 25,
      bio: userProfile?.bio || '',
      religiousLevel: userProfile?.religiousLevel || 'moderate',
      maritalStatus: userProfile?.maritalStatus || 'single',
      lookingFor: userProfile?.lookingFor || 'marriage',
      city: userProfile?.location?.city || '',
      country: userProfile?.location?.country || '',
    },
  });
  
  const onSubmit = (data: ProfileFormValues) => {
    try {
      updateUserProfile({
        ...userProfile as UserProfile,
        name: data.name,
        age: data.age,
        bio: data.bio,
        religiousLevel: data.religiousLevel,
        maritalStatus: data.maritalStatus,
        lookingFor: data.lookingFor,
        location: {
          ...userProfile?.location as any,
          city: data.city,
          country: data.country,
        },
      });
      
      setIsEditing(false);
      
      toast({
        title: 'Профиль обновлен',
        description: 'Ваш профиль был успешно обновлен',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось обновить профиль',
      });
    }
  };

  if (!userProfile) {
    return (
      <Layout title="Профиль">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-muslim-green-100 dark:bg-muslim-green-800 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <User className="h-8 w-8 text-muslim-green-600 dark:text-muslim-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-muslim-green-800 dark:text-white mb-2">
            Профиль не создан
          </h3>
          <p className="text-muslim-green-600 dark:text-muslim-green-300 max-w-xs text-center mb-4">
            Создайте свой профиль, чтобы начать знакомиться
          </p>
          <Button asChild>
            <a href="/register">Создать профиль</a>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Профиль">
      <div className="py-4">
        {/* Profile header */}
        <div className="mb-6 relative">
          {/* Profile photo */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-muslim-green-200 dark:border-muslim-green-700">
                <img 
                  src={userProfile.photos[0]} 
                  alt={userProfile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Premium badge */}
              {isPremium && (
                <span className="absolute -top-2 -right-2 premium-badge">
                  Premium
                </span>
              )}
              
              {/* Change photo button */}
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-muslim-green-600 text-white rounded-full flex items-center justify-center">
                <Camera size={16} />
              </button>
            </div>
          </div>
          
          {/* Profile name and basic info */}
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-muslim-green-800 dark:text-white">
              {userProfile.name}, {userProfile.age}
            </h2>
            
            <div className="flex items-center justify-center text-muslim-green-600 dark:text-muslim-green-300 text-sm mt-1">
              <MapPin size={16} className="mr-1" />
              <span>
                {userProfile.location?.city}, {userProfile.location?.country}
              </span>
            </div>
          </div>
          
          {/* Edit profile toggle */}
          <div className="flex justify-center">
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={() => setIsEditing(!isEditing)}
              size="sm"
            >
              {isEditing ? 'Отменить редактирование' : 'Редактировать профиль'}
            </Button>
          </div>
        </div>
      
        <Separator className="my-4" />
        
        {/* Profile form */}
        {isEditing ? (
          <Card className="p-4 border-muslim-green-200 dark:border-muslim-green-700">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Имя</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Возраст</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>О себе</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="religiousLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Уровень религиозности</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите уровень" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="practicing">Практикующий/ая</SelectItem>
                            <SelectItem value="moderate">Умеренно практикующий/ая</SelectItem>
                            <SelectItem value="cultural">Культурное соблюдение</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="maritalStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Семейное положение</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите статус" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="single">Не был/а в браке</SelectItem>
                            <SelectItem value="divorced">В разводе</SelectItem>
                            <SelectItem value="widowed">Вдовец/Вдова</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="lookingFor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Цель знакомства</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите цель" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="marriage">Брак</SelectItem>
                          <SelectItem value="friendship">Дружба</SelectItem>
                          <SelectItem value="both">Общение</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Город</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Страна</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  Сохранить изменения
                </Button>
              </form>
            </Form>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Profile sections */}
            <div>
              <h3 className="text-lg font-medium text-muslim-green-800 dark:text-white mb-2">
                О себе
              </h3>
              <p className="text-muslim-green-700 dark:text-muslim-green-300">
                {userProfile.bio}
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium text-muslim-green-800 dark:text-white mb-2">
                Религиозность
              </h3>
              <p className="text-muslim-green-700 dark:text-muslim-green-300">
                {userProfile.religiousLevel === "practicing" ? "Практикующий/ая" : 
                 userProfile.religiousLevel === "moderate" ? "Умеренно практикующий/ая" : 
                 "Культурное соблюдение"}
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium text-muslim-green-800 dark:text-white mb-2">
                Семейное положение
              </h3>
              <p className="text-muslim-green-700 dark:text-muslim-green-300">
                {userProfile.maritalStatus === "single" ? "Не был/а в браке" : 
                 userProfile.maritalStatus === "divorced" ? "В разводе" : 
                 "Вдовец/Вдова"}
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium text-muslim-green-800 dark:text-white mb-2">
                Цель знакомства
              </h3>
              <p className="text-muslim-green-700 dark:text-muslim-green-300">
                {userProfile.lookingFor === "marriage" ? "Брак" : 
                 userProfile.lookingFor === "friendship" ? "Дружба" : 
                 "Общение"}
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium text-muslim-green-800 dark:text-white mb-2">
                Интересы
              </h3>
              <div className="flex flex-wrap gap-2">
                {userProfile.interests.map((interest, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-muslim-green-100 dark:bg-muslim-green-800 text-muslim-green-700 dark:text-muslim-green-300 rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Profile;
