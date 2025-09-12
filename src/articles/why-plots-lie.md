---
layout: "layouts/article-template.njk"
title: "Eigenvalues, Power Laws, and Why Your Plot Lies"
dek: "A deep dive into the mathematical assumptions behind common data visualizations and how they can mislead us."
category: "Technical"
date: "2025-09-12"
read_time: "12 min read"
cover_image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop"
cover_image_alt: "A team working together at a desk with laptops and papers"
tags: ["posts"]
---

This is the opening paragraph. It sets the stage for the entire piece. Good prose is about clarity, rhythm, and flow. The goal is to make reading effortless, even when the topic is dense.

## Sub-heading for a New Section

Headings help structure the document. You can also include `inline code` for variable names or short snippets, like `matrix.eigen()`.

For mathematical notation, we use KaTeX. Inline math like $A\mathbf{v} = \lambda\mathbf{v}$ flows with the text. For more complex, display-style equations, we can use a block:

$$
SVD(A) = U \Sigma V^T
$$

> This is a blockquote. It's perfect for highlighting a key quote or an important takeaway, drawing the reader's eye.

## Code Blocks & Syntax Highlighting

For technical articles, clear code blocks are essential.

```python
# A Python code example
import numpy as np

def get_eigen(matrix):
  """
  Calculates eigenvalues and eigenvectors for a square matrix.
  """
  if matrix.shape[0] != matrix.shape[1]:
    raise ValueError("Only square matrices have eigenvalues.")

  eigenvalues, eigenvectors = np.linalg.eig(matrix)
  return eigenvalues, eigenvectors