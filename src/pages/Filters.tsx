
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useProfiles } from '@/hooks/useProfiles';

const filterSchema = z.object({
  minAge: z.coerce.number().min(18).max(70),
  maxAge: z.coerce.number().min(18).max(70),
  distance: z.coerce.number().min(1).max(100),
  religiousLevel: z.array(z.enum(['practicing', 'moderate', 'cultural'])).optional(),
  maritalStatus: z.array(z.enum(['single', 'divorced', 'widowed'])).optional(),
  lookingFor: z.enum(['marriage', 'friendship', 'both']).optional(),
  hasTelegram: z.boolean().optional(),
});

type FilterFormValues = z.infer<typeof filterSchema>;

const Filters = () => {
  const navigate = useNavigate();
  const { updateFilterSettings } = useProfiles();
  
  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      minAge: 18,
      maxAge: 50,
      distance: 50,
      religiousLevel: ['practicing', 'moderate', 'cultural'],
      maritalStatus: ['single', 'divorced', 'widowed'],
      lookingFor: 'both',
      hasTelegram: false,
    },
  });
  
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 50]);
  
  const onSubmit = (data: FilterFormValues) => {
    // Обновляем настройки фильтров
    updateFilterSettings(data);
    
    toast({
      title: "Фильтры сохранены",
      description: "Настройки поиска успешно обновлены",
    });
    
    // Возвращаемся на страницу дашборда
    navigate('/dashboard');
  };

  return (
    <Layout title="Настройки поиска">
      <div className="py-4">
        <Card className="border-muslim-green-200 dark:border-muslim-green-700">
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Возраст */}
                <div className="space-y-2">
                  <FormLabel>Возраст</FormLabel>
                  <div className="flex justify-between text-sm text-muslim-green-700 dark:text-muslim-green-300">
                    <span>{ageRange[0]} лет</span>
                    <span>{ageRange[1]} лет</span>
                  </div>
                  <Slider
                    defaultValue={ageRange}
                    min={18}
                    max={70}
                    step={1}
                    onValueChange={(value) => {
                      setAgeRange(value as [number, number]);
                      form.setValue('minAge', value[0]);
                      form.setValue('maxAge', value[1]);
                    }}
                    className="py-4"
                  />
                </div>
                
                {/* Расстояние */}
                <FormField
                  control={form.control}
                  name="distance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Максимальное расстояние</FormLabel>
                      <div className="flex justify-between text-sm text-muslim-green-700 dark:text-muslim-green-300">
                        <span>1 км</span>
                        <span>{field.value} км</span>
                        <span>100 км</span>
                      </div>
                      <FormControl>
                        <Slider
                          defaultValue={[field.value]}
                          min={1}
                          max={100}
                          step={1}
                          onValueChange={(value) => {
                            field.onChange(value[0]);
                          }}
                          className="py-4"
                        />
                      </FormControl>
                      <FormDescription>
                        Показывать профили не дальше указанного расстояния
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                {/* Уровень религиозности */}
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
                          <SelectItem value="both">Оба варианта</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Наличие Telegram */}
                <FormField
                  control={form.control}
                  name="hasTelegram"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Только с Telegram</FormLabel>
                        <FormDescription>
                          Показывать только профили с указанным Telegram
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {/* Кнопки */}
                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                  >
                    Отмена
                  </Button>
                  
                  <Button type="submit">
                    Применить фильтры
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Filters;
