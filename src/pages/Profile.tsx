
import { useState, useRef } from 'react';
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
import { Camera, User, MapPin, Upload, Image, X } from 'lucide-react';
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
  telegramUsername: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const { userProfile, updateUserProfile } = useProfiles();
  const { user, isPremium } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
      telegramUsername: userProfile?.telegramUsername || '',
    },
  });

  // Handle file selection
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Пожалуйста, выберите изображение',
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Размер файла не должен превышать 5MB',
      });
      return;
    }

    // Create a FileReader to read the file as a data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setUploadedPhoto(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const onSubmit = (data: ProfileFormValues) => {
    try {
      // Create new photos array with uploaded photo at the beginning if it exists
      const photos = uploadedPhoto 
        ? [uploadedPhoto, ...(userProfile?.photos || [])]
        : userProfile?.photos || [];

      updateUserProfile({
        ...userProfile as UserProfile,
        name: data.name,
        age: data.age,
        bio: data.bio,
        religiousLevel: data.religiousLevel,
        maritalStatus: data.maritalStatus,
        lookingFor: data.lookingFor,
        telegramUsername: data.telegramUsername,
        location: {
          ...userProfile?.location as any,
          city: data.city,
          country: data.country,
        },
        photos,
      });
      
      setIsEditing(false);
      setUploadedPhoto(null);
      
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
        <div className="mb-6 relative bg-gradient-to-r from-muslim-green-100 to-muslim-green-50 dark:from-muslim-green-800 dark:to-muslim-green-700 p-6 rounded-xl shadow-sm">
          {/* Profile photo */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-muslim-green-200 dark:border-muslim-green-700 shadow-lg">
                <img 
                  src={uploadedPhoto || userProfile.photos[0]} 
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
              {isEditing && (
                <button 
                  className="absolute bottom-0 right-0 w-10 h-10 bg-muslim-green-600 text-white rounded-full flex items-center justify-center hover:bg-muslim-green-700 transition-colors shadow-lg"
                  onClick={handleUploadClick}
                >
                  <Camera size={20} />
                </button>
              )}

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handlePhotoSelect}
              />
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

            {userProfile.telegramUsername && (
              <div className="mt-1 text-muslim-green-600 dark:text-muslim-green-300 text-sm">
                Telegram: @{userProfile.telegramUsername}
              </div>
            )}
          </div>
          
          {/* Edit profile toggle */}
          <div className="flex justify-center">
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={() => setIsEditing(!isEditing)}
              size="sm"
              className="shadow-sm"
            >
              {isEditing ? 'Отменить редактирование' : 'Редактировать профиль'}
            </Button>
          </div>
        </div>
      
        <Separator className="my-4" />
        
        {/* Profile form */}
        {isEditing ? (
          <Card className="p-6 border-muslim-green-200 dark:border-muslim-green-700 bg-white dark:bg-muslim-green-800 shadow-md">
            {/* Photo upload section */}
            {uploadedPhoto ? (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-muslim-green-700 dark:text-muslim-green-300 mb-2">Новое фото:</h3>
                <div className="relative w-32 h-32 bg-muslim-green-50 dark:bg-muslim-green-900 rounded-lg overflow-hidden border border-muslim-green-200 dark:border-muslim-green-700 mx-auto">
                  <img src={uploadedPhoto} alt="Uploaded" className="w-full h-full object-cover" />
                  <button 
                    className="absolute top-2 right-2 bg-muslim-green-600 text-white rounded-full p-1 hover:bg-muslim-green-700"
                    onClick={() => setUploadedPhoto(null)}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <Button
                  variant="outline"
                  onClick={handleUploadClick}
                  className="w-full py-8 border-dashed border-2 flex flex-col items-center gap-2"
                >
                  <Upload size={24} className="text-muslim-green-600 dark:text-muslim-green-400" />
                  <span>Загрузить фото</span>
                  <span className="text-xs text-muslim-green-500 dark:text-muslim-green-400">JPG, PNG, GIF (макс. 5MB)</span>
                </Button>
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Имя</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-muslim-green-50 dark:bg-muslim-green-700 border-muslim-green-200 dark:border-muslim-green-600" />
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
                        <Input type="number" {...field} className="bg-muslim-green-50 dark:bg-muslim-green-700 border-muslim-green-200 dark:border-muslim-green-600" />
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
                        <Textarea {...field} className="bg-muslim-green-50 dark:bg-muslim-green-700 border-muslim-green-200 dark:border-muslim-green-600 min-h-[100px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telegramUsername"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telegram (без @)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="username" 
                          className="bg-muslim-green-50 dark:bg-muslim-green-700 border-muslim-green-200 dark:border-muslim-green-600" 
                        />
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
                            <SelectTrigger className="bg-muslim-green-50 dark:bg-muslim-green-700 border-muslim-green-200 dark:border-muslim-green-600">
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
                            <SelectTrigger className="bg-muslim-green-50 dark:bg-muslim-green-700 border-muslim-green-200 dark:border-muslim-green-600">
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
                          <SelectTrigger className="bg-muslim-green-50 dark:bg-muslim-green-700 border-muslim-green-200 dark:border-muslim-green-600">
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
                          <Input {...field} className="bg-muslim-green-50 dark:bg-muslim-green-700 border-muslim-green-200 dark:border-muslim-green-600" />
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
                          <Input {...field} className="bg-muslim-green-50 dark:bg-muslim-green-700 border-muslim-green-200 dark:border-muslim-green-600" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full shadow-md bg-muslim-green-600 hover:bg-muslim-green-700 text-white"
                >
                  Сохранить изменения
                </Button>
              </form>
            </Form>
          </Card>
        ) : (
          <div className="space-y-6 bg-white dark:bg-muslim-green-800 p-6 rounded-xl shadow-md">
            {/* Profile photo gallery */}
            {userProfile.photos.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-muslim-green-800 dark:text-white mb-3">
                  Фотографии
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {userProfile.photos.map((photo, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden border border-muslim-green-200 dark:border-muslim-green-700">
                      <img 
                        src={photo} 
                        alt={`Photo ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />
            
            {/* Profile sections */}
            <div>
              <h3 className="text-lg font-medium text-muslim-green-800 dark:text-white mb-2">
                О себе
              </h3>
              <p className="text-muslim-green-700 dark:text-muslim-green-300 bg-muslim-green-50 dark:bg-muslim-green-700/50 p-3 rounded-lg">
                {userProfile.bio}
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium text-muslim-green-800 dark:text-white mb-2">
                Религиозность
              </h3>
              <p className="text-muslim-green-700 dark:text-muslim-green-300 bg-muslim-green-50 dark:bg-muslim-green-700/50 p-3 rounded-lg">
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
              <p className="text-muslim-green-700 dark:text-muslim-green-300 bg-muslim-green-50 dark:bg-muslim-green-700/50 p-3 rounded-lg">
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
              <p className="text-muslim-green-700 dark:text-muslim-green-300 bg-muslim-green-50 dark:bg-muslim-green-700/50 p-3 rounded-lg">
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
              <div className="flex flex-wrap gap-2 bg-muslim-green-50 dark:bg-muslim-green-700/50 p-3 rounded-lg">
                {userProfile.interests.map((interest, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-muslim-green-100 dark:bg-muslim-green-800 text-muslim-green-700 dark:text-muslim-green-300 rounded-full text-sm border border-muslim-green-200 dark:border-muslim-green-600"
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
