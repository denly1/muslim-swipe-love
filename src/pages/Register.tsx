
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/components/ui/use-toast';
import Layout from '@/components/Layout';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useProfiles } from '@/hooks/useProfiles';

const profileSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  age: z.coerce.number().min(18, 'Возраст должен быть от 18 лет').max(100, 'Возраст не может быть больше 100 лет'),
  bio: z.string().min(20, 'Опишите себя минимум 20 символами'),
  religiousLevel: z.enum(['practicing', 'moderate', 'cultural']),
  maritalStatus: z.enum(['single', 'divorced', 'widowed']),
  lookingFor: z.enum(['marriage', 'friendship', 'both']),
  city: z.string().min(2, 'Укажите город'),
  country: z.string().min(2, 'Укажите страну'),
  interests: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Register = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createUserProfile, requestLocationPermission } = useProfiles();
  const [step, setStep] = useState(1);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      age: 25,
      bio: '',
      religiousLevel: 'moderate',
      maritalStatus: 'single',
      lookingFor: 'marriage',
      city: '',
      country: '',
      interests: '',
    },
  });
  
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      // Request location permission
      if (!locationPermissionGranted) {
        const granted = await requestLocationPermission();
        setLocationPermissionGranted(granted);
      }
      
      // Process interests (comma-separated to array)
      const interestsArray = data.interests 
        ? data.interests.split(',').map(i => i.trim()).filter(i => i) 
        : [];
      
      // Create user profile
      createUserProfile({
        name: data.name,
        age: data.age,
        bio: data.bio,
        religiousLevel: data.religiousLevel,
        maritalStatus: data.maritalStatus,
        lookingFor: data.lookingFor,
        photos: [
          // Default avatar if no photo is uploaded
          'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80',
        ],
        location: {
          city: data.city,
          country: data.country,
          latitude: 0, // Will be updated by location permission
          longitude: 0, // Will be updated by location permission
        },
        interests: interestsArray,
      });
      
      // Navigate to the dashboard
      navigate('/dashboard');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка создания профиля",
        description: error instanceof Error ? error.message : "Пожалуйста, попробуйте снова",
      });
    }
  };
  
  const nextStep = () => {
    if (step === 1) {
      // Validate first step fields
      form.trigger(['name', 'age', 'bio']);
      if (!form.formState.errors.name && !form.formState.errors.age && !form.formState.errors.bio) {
        setStep(2);
      }
    } else if (step === 2) {
      // Validate second step fields
      form.trigger(['religiousLevel', 'maritalStatus', 'lookingFor']);
      if (!form.formState.errors.religiousLevel && !form.formState.errors.maritalStatus && !form.formState.errors.lookingFor) {
        setStep(3);
      }
    }
  };
  
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <Layout title="Создание профиля" hideNavigation>
      <div className="py-4">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-muslim-green-800 dark:text-white">
              Шаг {step} из 3
            </h2>
            <div className="flex space-x-1">
              <div className={`h-2 w-8 rounded-full ${step >= 1 ? 'bg-muslim-green-600' : 'bg-muslim-green-200 dark:bg-muslim-green-700'}`}></div>
              <div className={`h-2 w-8 rounded-full ${step >= 2 ? 'bg-muslim-green-600' : 'bg-muslim-green-200 dark:bg-muslim-green-700'}`}></div>
              <div className={`h-2 w-8 rounded-full ${step >= 3 ? 'bg-muslim-green-600' : 'bg-muslim-green-200 dark:bg-muslim-green-700'}`}></div>
            </div>
          </div>
        </div>
        
        <Card className="border-muslim-green-200 dark:border-muslim-green-700">
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Step 1: Basic Info */}
                {step === 1 && (
                  <>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Имя</FormLabel>
                          <FormControl>
                            <Input placeholder="Ваше имя" {...field} />
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
                            <Input type="number" min={18} max={100} {...field} />
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
                            <Textarea 
                              placeholder="Расскажите о себе, своих интересах и чего вы ищете..."
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                
                {/* Step 2: Religious & Relationship Info */}
                {step === 2 && (
                  <>
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
                                <SelectValue placeholder="Выберите уровень религиозности" />
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
                                <SelectValue placeholder="Выберите семейное положение" />
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
                                <SelectValue placeholder="Выберите цель знакомства" />
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
                  </>
                )}
                
                {/* Step 3: Location & Interests */}
                {step === 3 && (
                  <>
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Город</FormLabel>
                          <FormControl>
                            <Input placeholder="Ваш город" {...field} />
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
                            <Input placeholder="Ваша страна" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="interests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Интересы</FormLabel>
                          <FormControl>
                            <Input placeholder="Ислам, спорт, книги, семья, путешествия..." {...field} />
                          </FormControl>
                          <FormDescription>
                            Введите интересы через запятую
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="pt-2">
                      <Button 
                        onClick={async () => {
                          const granted = await requestLocationPermission();
                          setLocationPermissionGranted(granted);
                        }}
                        type="button"
                        variant="outline"
                        className={locationPermissionGranted ? "bg-muslim-green-50 text-muslim-green-700" : ""}
                      >
                        {locationPermissionGranted 
                          ? "✓ Геолокация разрешена" 
                          : "Разрешить геолокацию"}
                      </Button>
                      <FormDescription className="mt-2">
                        Геолокация поможет находить знакомства поблизости от вас
                      </FormDescription>
                    </div>
                  </>
                )}
                
                {/* Navigation buttons */}
                <div className="flex justify-between pt-4">
                  {step > 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                    >
                      Назад
                    </Button>
                  ) : (
                    <span />
                  )}
                  
                  {step < 3 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                    >
                      Далее
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? 'Сохранение...' : 'Завершить'}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Register;
