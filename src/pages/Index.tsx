
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const loginSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const Index = () => {
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('login');
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/dashboard');
  }
  
  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });
  
  // Handle login form submission
  const onLoginSubmit = async (data: LoginFormValues) => {
    await login(data.email, data.password);
  };
  
  // Handle register form submission
  const onRegisterSubmit = async (data: RegisterFormValues) => {
    await register(data.name, data.email, data.password);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section */}
      <div className="bg-muslim-green-600 text-white py-12">
        <div className="container px-4 mx-auto text-center">
          <h1 className="text-3xl font-bold mb-2">Halal Match</h1>
          <p className="text-muslim-green-100 mb-6">
            Благословенные знакомства для мусульман
          </p>
        </div>
      </div>
      
      {/* Auth cards */}
      <div className="flex-1 bg-gradient-to-b from-muslim-green-50 to-white dark:from-muslim-green-900 dark:to-muslim-green-800 py-8">
        <div className="container px-4 mx-auto max-w-md">
          <Card className="border-muslim-green-200 dark:border-muslim-green-700 shadow-lg">
            <CardHeader className="pb-4">
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Вход</TabsTrigger>
                  <TabsTrigger value="register">Регистрация</TabsTrigger>
                </TabsList>
              
                <CardContent>
                  <TabsContent value="login" className="mt-0">
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                        <FormField
                          control={loginForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="email@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Пароль</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="••••••" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          className="w-full bg-muslim-green-600 hover:bg-muslim-green-700"
                          disabled={loginForm.formState.isSubmitting}
                        >
                          {loginForm.formState.isSubmitting ? 'Загрузка...' : 'Войти'}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                  
                  <TabsContent value="register" className="mt-0">
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                        <FormField
                          control={registerForm.control}
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
                          control={registerForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="email@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Пароль</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="••••••" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          className="w-full bg-muslim-green-600 hover:bg-muslim-green-700"
                          disabled={registerForm.formState.isSubmitting}
                        >
                          {registerForm.formState.isSubmitting ? 'Загрузка...' : 'Зарегистрироваться'}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </CardHeader>
            
            <CardFooter className="flex flex-col space-y-2 border-t border-muslim-green-200 dark:border-muslim-green-700 pt-4">
              <p className="text-sm text-center text-muslim-green-600 dark:text-muslim-green-400">
                Регистрируясь, вы соглашаетесь с нашими правилами и даете согласие на обработку персональных данных.
              </p>
            </CardFooter>
          </Card>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-muslim-green-600 dark:text-muslim-green-400">
              © 2023 Halal Match. Все права защищены.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
