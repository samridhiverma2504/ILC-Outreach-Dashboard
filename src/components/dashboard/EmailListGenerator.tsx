import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function EmailListGenerator() {
  const [inputText, setInputText] = useState('');
  const [extractedEmails, setExtractedEmails] = useState<string[]>([]);

  const extractEmails = () => {
    // Regex to find email addresses
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
    const matches = inputText.match(emailRegex);
    
    if (matches) {
      // Remove duplicates
      const uniqueEmails = Array.from(new Set(matches));
      setExtractedEmails(uniqueEmails);
      toast.success(`Found ${uniqueEmails.length} unique emails`);
    } else {
      setExtractedEmails([]);
      toast.info("No emails found in the text.");
    }
  };

  const downloadCSV = () => {
    if (extractedEmails.length === 0) return;

    const csvContent = "data:text/csv;charset=utf-8," + "Email Address\n" + extractedEmails.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "email_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">OneIllinois Email List Generator</h2>
        <p className="text-muted-foreground">Extract and format email addresses from raw text.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input Text</CardTitle>
            <CardDescription>Paste raw text containing emails here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              className="min-h-[400px]"
              placeholder="Paste text like: 'John (john@example.com), Jane <jane@test.org>...'"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <Button onClick={extractEmails} className="w-full">
              <FileText className="mr-2 h-4 w-4" /> Extract Emails
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Extracted Emails ({extractedEmails.length})</CardTitle>
            <CardDescription>Review and export your list.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex flex-col h-[500px]">
            <div className="border rounded-md flex-1 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No.</TableHead>
                    <TableHead>Email Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {extractedEmails.length > 0 ? (
                    extractedEmails.map((email, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{email}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center h-24 text-muted-foreground">
                        No emails extracted yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <Button onClick={downloadCSV} disabled={extractedEmails.length === 0} variant="secondary" className="w-full">
              <Download className="mr-2 h-4 w-4" /> Download CSV
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
