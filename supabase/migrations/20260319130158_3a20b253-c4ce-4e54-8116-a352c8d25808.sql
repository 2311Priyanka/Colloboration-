
-- Fix overly permissive feedback insert policy
DROP POLICY "Anyone authenticated can insert feedback" ON public.feedback;
CREATE POLICY "Authenticated users can insert feedback" ON public.feedback FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
