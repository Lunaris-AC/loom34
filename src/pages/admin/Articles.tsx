import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Eye, FileText } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { ImageUpload } from '@/components/admin/ImageUpload';

interface Article {
  id: string;
  title: string;
  category: string;
  date: string;
  published: boolean;
  slug: string;
  content: string;
  excerpt: string;
  image: string;
}

export default function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Form state for new/edit article
  const [articleForm, setArticleForm] = useState({
    title: "",
    category: "",
    excerpt: "",
    content: "",
    image: "https://placehold.co/600x400?text=Article+Image",
    published: false,
    slug: ""
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, category, date, published, slug, content, excerpt, image')
        .order('date', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error: any) {
      console.error("Error fetching articles:", error);
      toast.error("Failed to load articles: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setArticleForm({ ...articleForm, [name]: value });
    
    // Auto-generate slug from title
    if (name === "title") {
      setArticleForm(prev => ({
        ...prev,
        slug: value.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-')
      }));
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setArticleForm({ ...articleForm, published: checked });
  };

  const resetForm = () => {
    setArticleForm({
      title: "",
      category: "",
      excerpt: "",
      content: "",
      image: "https://placehold.co/600x400?text=Article+Image",
      published: false,
      slug: ""
    });
    setIsCreating(true);
    setSelectedArticle(null);
    setDialogOpen(true);
  };

  const handleCreateArticle = async () => {
    try {
      const { title, category, excerpt, content, image, published, slug } = articleForm;
      
      if (!title || !category || !excerpt || !content || !slug) {
        toast.error("Please fill all required fields");
        return;
      }
      
      const newArticle = {
        title,
        category,
        excerpt,
        content,
        image,
        published,
        slug,
        author_id: user?.id
      };
      
      const { data, error } = await supabase
        .from('articles')
        .insert(newArticle)
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success("Article created successfully");
      fetchArticles();
      setDialogOpen(false);
    } catch (error: any) {
      console.error("Error creating article:", error);
      toast.error("Failed to create article: " + error.message);
    }
  };

  const handleUpdateArticle = async () => {
    if (!selectedArticle) return;
    
    try {
      const { title, category, excerpt, content, image, published, slug } = articleForm;
      
      if (!title || !category || !excerpt || !content || !slug) {
        toast.error("Please fill all required fields");
        return;
      }
      
      const updatedArticle = {
        title,
        category,
        excerpt,
        content,
        image,
        published,
        slug,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('articles')
        .update(updatedArticle)
        .eq('id', selectedArticle.id);
        
      if (error) throw error;
      
      toast.success("Article updated successfully");
      fetchArticles();
      setDialogOpen(false);
    } catch (error: any) {
      console.error("Error updating article:", error);
      toast.error("Failed to update article: " + error.message);
    }
  };

  const handleDeleteArticle = async () => {
    if (!selectedArticle) return;
    
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', selectedArticle.id);
        
      if (error) throw error;
      
      toast.success("Article deleted successfully");
      fetchArticles();
      setDeleteDialogOpen(false);
    } catch (error: any) {
      console.error("Error deleting article:", error);
      toast.error("Failed to delete article: " + error.message);
    }
  };

  const editArticle = (article: Article) => {
    setSelectedArticle(article);
    setArticleForm({
      title: article.title,
      category: article.category,
      excerpt: article.excerpt,
      content: article.content,
      image: article.image,
      published: article.published,
      slug: article.slug
    });
    setIsCreating(false);
    setDialogOpen(true);
  };

  const confirmDelete = (article: Article) => {
    setSelectedArticle(article);
    setDeleteDialogOpen(true);
  };

  return (
    <AdminLayout title="Articles">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Gestion des articles</h2>
          <p className="text-gray-500 mt-1">Créez, modifiez et gérez vos articles de blog</p>
        </div>
        <Button 
          variant="brown"
          className="bg-brown hover:bg-brown/90" 
          onClick={resetForm}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvel article
        </Button>
      </div>

      <Separator className="my-4" />

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-md border border-gray-200">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Aucun article trouvé</h3>
          <p className="text-gray-500 mb-4">Vous n'avez pas encore créé d'articles.</p>
          <Button 
            variant="brown"
            className="bg-brown hover:bg-brown/90" 
            onClick={resetForm}
          >
            <Plus className="h-4 w-4 mr-2" />
            Créer votre premier article
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">{article.title}</TableCell>
                  <TableCell>{article.category}</TableCell>
                  <TableCell>{formatDate(article.date)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      article.published
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {article.published ? "Publié" : "Brouillon"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center space-x-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/articles/${article.slug}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Voir</span>
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => editArticle(article)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Modifier</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => confirmDelete(article)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Article Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isCreating ? "Create New Article" : "Edit Article"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input
                id="title"
                name="title"
                value={articleForm.title}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Article title"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="slug" className="text-right">Slug</Label>
              <Input
                id="slug"
                name="slug"
                value={articleForm.slug}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="article-slug"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <Input
                id="category"
                name="category"
                value={articleForm.category}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Article category"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="excerpt" className="text-right pt-2">Excerpt</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={articleForm.excerpt}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="A short excerpt of the article"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="content" className="text-right pt-2">Content</Label>
              <Textarea
                id="content"
                name="content"
                value={articleForm.content}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Full article content"
                rows={10}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="image" className="text-right pt-2">Image</Label>
              <div className="col-span-3">
                <ImageUpload
                  onImageUploaded={(url) => setArticleForm(prev => ({ ...prev, image: url }))}
                  defaultImage={articleForm.image}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="published" className="text-right">Published</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={articleForm.published}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="published">
                  {articleForm.published ? "Published" : "Draft"}
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="brown" onClick={isCreating ? handleCreateArticle : handleUpdateArticle}>
              {isCreating ? "Create Article" : "Update Article"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete the article "{selectedArticle?.title}"? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteArticle}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
